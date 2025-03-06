
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, Upload, Loader2, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/MapComponent";
import { Card, CardContent } from "@/components/ui/card";
import { HazardType } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { createHazardReport } from "@/services/hazardService";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  type: z.enum(["pothole", "waterlogging", "other"], {
    required_error: "Please select a hazard type",
  }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),
  address: z.string().min(5, { message: "Please provide a valid address" }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image: z.instanceof(File).optional(),
});

const ReportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      description: "",
      address: "",
    },
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.error("Please log in to report a hazard");
      navigate("/login");
    }
  }, [user, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to submit a report");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (values.image) {
        const fileExt = values.image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `hazard-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('hazard-images')
          .upload(filePath, values.image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data } = supabase.storage
          .from('hazard-images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Create hazard report
      if (!values.latitude || !values.longitude) {
        throw new Error("Location coordinates are required");
      }
      
      const report = await createHazardReport(
        values.type,
        values.description,
        {
          lat: values.latitude,
          lng: values.longitude,
          address: values.address
        },
        user.id,
        imageUrl || undefined
      );
      
      if (!report) {
        throw new Error("Failed to create report");
      }
      
      toast.success("Hazard reported successfully!");
      navigate("/map");
    } catch (error: any) {
      console.error("Report error:", error);
      toast.error(error.message || "There was an error submitting your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5MB");
      return;
    }
    
    form.setValue("image", file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    form.setValue("latitude", location.lat);
    form.setValue("longitude", location.lng);
    form.setValue("address", location.address);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-16 pt-6 sm:px-6 animate-fade-in">
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Report a Hazard</h1>
          <p className="text-muted-foreground">
            Help keep your community safe by reporting public hazards
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[300px]">
                  <MapComponent 
                    showControls={true}
                    onSelectLocation={handleLocationSelect}
                    readOnly={false}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 className="font-medium mb-2 flex items-center">
                <MapPin size={16} className="mr-2 text-primary" />
                Location Details
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Click on the map or use the locate button to select the hazard location
              </p>
              
              {form.watch("address") && (
                <div className="bg-white p-3 rounded-md border border-border">
                  <div className="text-sm font-medium">Selected Location</div>
                  <div className="text-sm text-muted-foreground">
                    {form.watch("address")}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hazard Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a hazard type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pothole">Pothole</SelectItem>
                          <SelectItem value="waterlogging">Water Logging</SelectItem>
                          <SelectItem value="other">Other Hazard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of hazard you want to report
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the hazard in detail..."
                          {...field}
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about the hazard, its severity, and any other relevant information
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address or location description" {...field} />
                      </FormControl>
                      <FormDescription>
                        The address will be automatically filled when you select a location on the map
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload Image (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center">
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => document.getElementById("image")?.click()}
                              className="mr-2"
                            >
                              <Upload size={16} className="mr-2" />
                              Select Image
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {value?.name || "No file selected"}
                            </span>
                          </div>
                          
                          {imagePreview && (
                            <div className="relative h-48 w-full overflow-hidden rounded-md border border-border">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={() => {
                                  setImagePreview(null);
                                  form.setValue("image", undefined);
                                }}
                              >
                                &times;
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload an image of the hazard (max size: 5MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Hazard Report"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportPage;
