import { useState, useEffect, useCallback } from "react";
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
import { toast } from "sonner";
import { Camera, Upload, Loader2, MapPin, ImageIcon, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/MapComponent";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { createHazardReport } from "@/services/hazardService";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { detectHazardFromFile } from "@/services/hazardDetectionService";
import { formatConfidence, formatHazardType, fileToDataURL } from "@/lib/utils";

// Updated form schema without the type field (will be detected from image)
const formSchema = z.object({
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),
  address: z.string().min(5, { message: "Please provide a valid address" }),
  manualAddress: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image: z.instanceof(File).optional(),
  detectedHazardType: z.string().optional(),
});

const ReportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDetectingHazard, setIsDetectingHazard] = useState(false);
  const [detectedHazard, setDetectedHazard] = useState<{
    type: string;
    confidence: number;
  } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      address: "",
      manualAddress: "",
      detectedHazardType: "",
    },
  });

  // Fetch current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue("latitude", latitude);
          form.setValue("longitude", longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [form]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to report a hazard");
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to submit a report");
      navigate("/login");
      return;
    }

    // Ensure we have a hazard type (either detected or "other")
    const hazardType = values.detectedHazardType || "other";

    // Use manual address if provided, otherwise use map address
    const finalAddress = values.manualAddress && values.manualAddress.trim() !== "" 
      ? values.manualAddress 
      : values.address;

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
        hazardType as any, // Cast to any to match the expected enum type
        values.description,
        {
          lat: values.latitude,
          lng: values.longitude,
          address: finalAddress
        },
        user.id,
        imageUrl || undefined
      );
      
      if (!report) {
        throw new Error("Failed to create report");
      }
      
      // Show success with animation
      toast.success("Hazard reported successfully!");
      
      // Navigate to map view after a short delay for better UX
      setTimeout(() => navigate("/map"), 1000);
    } catch (error: any) {
      console.error("Report error:", error);
      toast.error(error.message || "There was an error submitting your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image selection and process for hazard detection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5MB");
      return;
    }
    
    form.setValue("image", file);
    
    // Create preview
    try {
      const imageDataUrl = await fileToDataURL(file);
      setImagePreview(imageDataUrl);
      
      // Start hazard detection
      await detectHazardFromImage(file);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image");
    }
  };

  // Detect hazard from the image
  const detectHazardFromImage = async (file: File) => {
    setIsDetectingHazard(true);
    setDetectedHazard(null);
    
    try {
      const result = await detectHazardFromFile(file);
      
      if (result.type === "unknown") {
        toast.warning("Could not detect hazard type. Please describe it in the description field.");
      } else {
        setDetectedHazard({
          type: result.type,
          confidence: result.confidence
        });
        
        // Update form with detected hazard type
        form.setValue("detectedHazardType", result.type);
        
        // Generate a description suggestion based on detected hazard
        const currentDesc = form.getValues("description");
        if (!currentDesc || currentDesc.trim() === "") {
          const suggestionDesc = `This appears to be a ${formatHazardType(result.type).toLowerCase()} hazard.`;
          form.setValue("description", suggestionDesc);
        }
        
        toast.success(`Detected: ${formatHazardType(result.type)} (${formatConfidence(result.confidence)} confidence)`);
      }
    } catch (error) {
      console.error("Error detecting hazard:", error);
      toast.error("Failed to detect hazard type from image");
    } finally {
      setIsDetectingHazard(false);
    }
  };

  // Handle location selection from map
  const handleLocationSelect = useCallback((location: { lat: number; lng: number; address: string }) => {
    form.setValue("latitude", location.lat);
    form.setValue("longitude", location.lng);
    form.setValue("address", location.address);
  }, [form]);

  // If not authenticated, don't render the form
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pb-16 pt-6 sm:px-6 animate-fade-in">
        <div className="w-full mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Report a Hazard</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help keep your community safe by reporting public hazards. 
            Take a photo and we'll automatically detect the hazard type.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 order-2 md:order-1 animate-fade-up" style={{animationDelay: "0.2s"}}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <MapComponent 
                    showControls={true}
                    onSelectLocation={handleLocationSelect}
                    readOnly={false}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="glass-card rounded-lg p-6">
              <h3 className="font-medium mb-3 flex items-center">
                <MapPin size={18} className="mr-2 text-primary" />
                Location Details
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click on the map or use the locate button to select the hazard location
              </p>
              
              {form.watch("address") && (
                <div className="bg-secondary/50 p-4 rounded-md mb-4 animate-fade-up">
                  <div className="text-sm font-medium">Selected Location</div>
                  <div className="text-sm text-muted-foreground line-clamp-3 mb-2">
                    {form.watch("address")}
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    Lat: {form.watch("latitude")?.toFixed(6)}, 
                    Lng: {form.watch("longitude")?.toFixed(6)}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="order-1 md:order-2 animate-fade-up" style={{animationDelay: "0.3s"}}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Upload Hazard Image (Required)
                          </FormLabel>
                          <FormDescription>
                            We'll automatically detect the hazard type from your image
                          </FormDescription>
                          <FormControl>
                            <div className="flex flex-col space-y-4">
                              <div className="flex items-center">
                                <Input
                                  id="image"
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  className="hidden"
                                  onChange={handleImageChange}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={() => document.getElementById("image")?.click()}
                                  className="mr-2"
                                >
                                  <Camera size={16} className="mr-2" />
                                  Take Photo
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById("image")?.click()}
                                >
                                  <Upload size={16} className="mr-2" />
                                  Upload
                                </Button>
                              </div>
                              
                              {!imagePreview ? (
                                <div className="h-48 w-full border border-dashed border-border rounded-md flex flex-col items-center justify-center text-muted-foreground">
                                  <ImageIcon size={32} className="mb-2 opacity-50" />
                                  <p>No image selected</p>
                                </div>
                              ) : (
                                <div className="relative">
                                  <div className="image-preview-container h-48 w-full overflow-hidden rounded-md">
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
                                        setDetectedHazard(null);
                                        form.setValue("image", undefined);
                                        form.setValue("detectedHazardType", "");
                                      }}
                                    >
                                      &times;
                                    </Button>
                                  </div>
                                  
                                  {isDetectingHazard && (
                                    <div className="hazard-detection-box detecting mt-2">
                                      <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
                                      <span>Detecting hazard type...</span>
                                    </div>
                                  )}
                                  
                                  {detectedHazard && (
                                    <div className="hazard-detection-box mt-2 bg-secondary/70 border-primary/30">
                                      <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                                      <span>Detected: <strong>{formatHazardType(detectedHazard.type)}</strong></span>
                                      <span className="ml-2 text-sm text-muted-foreground">
                                        ({formatConfidence(detectedHazard.confidence)} confidence)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Description</FormLabel>
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
                      name="manualAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Manual Location (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter location details manually" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            You can enter a manual address if the map location isn't precise
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting || !form.getValues("image")}
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
                  </CardContent>
                </Card>
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
