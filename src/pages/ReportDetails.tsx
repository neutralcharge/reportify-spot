
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHazardReportById, updateHazardReport } from "@/services/hazardService";
import { HazardStatus } from "@/types/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import MapComponent from "@/components/MapComponent";
import { useAuth } from "@/contexts/AuthContext";

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view report details");
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch the report details
  const { data: report, isLoading, error, refetch } = useQuery({
    queryKey: ['report', id],
    queryFn: () => id ? getHazardReportById(id) : Promise.resolve(null),
    enabled: !!id && !!user,
  });

  const handleStatusChange = async (newStatus: HazardStatus) => {
    if (!report || !id) return;
    
    setUpdatingStatus(true);
    try {
      await updateHazardReport(id, { status: newStatus });
      refetch();
      toast.success(`Report status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update report status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Loading report details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Report Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the report you're looking for. It may have been removed or you might not have permission to view it.
            </p>
            <Button asChild>
              <Link to="/my-reports">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Reports
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isUserOwner = user?.id === report.reported_by;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="mb-4"
              >
                <Link to="/my-reports">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to My Reports
                </Link>
              </Button>
              
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Report Details</h1>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={`${
                      report.type === "pothole" 
                        ? "bg-hazard-pothole text-white" 
                        : report.type === "waterlogging" 
                          ? "bg-hazard-waterlogging text-white" 
                          : "bg-hazard-other text-white"
                    }`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={`
                      ${report.status === "active" 
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                        : report.status === "resolved" 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      } px-2 py-0.5 text-xs uppercase`
                    }>
                      {report.status}
                    </Badge>
                  </div>
                </div>
                
                {isUserOwner && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground mr-2">Update status:</span>
                    <Select
                      value={report.status}
                      onValueChange={handleStatusChange}
                      disabled={updatingStatus}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hazard Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{report.description}</p>
                  </CardContent>
                </Card>
                
                {report.image_url && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Image</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-hidden">
                        <img 
                          src={report.image_url} 
                          alt={report.description}
                          className="w-full h-auto"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[300px]">
                      <MapComponent 
                        readOnly={true}
                        initialLocation={{ lat: report.location.lat, lng: report.location.lng }}
                      />
                    </div>
                    <div className="p-6 flex items-start">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>{report.location.address}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Reported On</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.reported_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Reported By</p>
                        <p className="text-sm text-muted-foreground">
                          {report.reported_by === user?.id ? 'You' : report.reported_by}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <ThumbsUp className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Votes</p>
                        <p className="text-sm text-muted-foreground">
                          {report.votes} {report.votes === 1 ? 'person has' : 'people have'} upvoted this hazard
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Comments</p>
                        <p className="text-sm text-muted-foreground">
                          {report.comments} {report.comments === 1 ? 'comment' : 'comments'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Status History</CardTitle>
                    <CardDescription>Timeline of status changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <AlertCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Reported</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.reported_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {report.status === "investigating" || report.status === "resolved" ? (
                        <div className="flex items-start">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                            <Loader2 className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Under Investigation</p>
                            <p className="text-sm text-muted-foreground">
                              The authorities are looking into this issue
                            </p>
                          </div>
                        </div>
                      ) : null}
                      
                      {report.status === "resolved" ? (
                        <div className="flex items-start">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                            <CheckCircle className="h-5 w-5 text-green-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Resolved</p>
                            <p className="text-sm text-muted-foreground">
                              This hazard has been fixed
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      className="w-full mb-2"
                      variant="default"
                    >
                      Contact Local Authority
                    </Button>
                    
                    {report.status !== "resolved" && (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleStatusChange("resolved")}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Resolved
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportDetails;
