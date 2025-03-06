
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHazardReportById, updateHazardReport } from "@/services/hazardService";
import { HazardReport, HazardStatus } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  User, 
  ThumbsUp, 
  MessageSquare,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import MapComponent from "@/components/MapComponent";

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch report details
  const { data: report, isLoading, error, refetch } = useQuery({
    queryKey: ['reportDetails', id],
    queryFn: () => getHazardReportById(id || ''),
    enabled: !!id,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Loading Report Details</h2>
            <p className="text-muted-foreground">Please wait while we fetch the report information...</p>
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
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The report you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link to="/my-reports">
                <ArrowLeft size={16} className="mr-2" />
                Back to My Reports
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle status change
  const handleStatusChange = async (newStatus: HazardStatus) => {
    try {
      await updateHazardReport(report.id, { status: newStatus });
      refetch();
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determine if user is the owner of this report
  const isOwner = user && user.id === report.reported_by;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <div className="mb-6">
              <Button variant="ghost" asChild>
                <Link to="/my-reports">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to My Reports
                </Link>
              </Button>
            </div>
            
            {/* Report header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={`
                  ${report.type === "pothole" 
                    ? "bg-red-500" 
                    : report.type === "waterlogging" 
                      ? "bg-blue-500" 
                      : "bg-orange-500"} 
                  text-white hover:opacity-80`
                }>
                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                </Badge>
                <Badge className={`
                  ${report.status === "active" 
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                    : report.status === "resolved" 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  } hover:bg-opacity-80`
                }>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Hazard Report</h1>
              <p className="text-muted-foreground">
                View detailed information about this hazard report
              </p>
            </div>
            
            {/* Report content */}
            <div className="grid md:grid-cols-5 gap-8">
              {/* Map */}
              <div className="md:col-span-3">
                <Card className="overflow-hidden">
                  <div className="h-[300px]">
                    <MapComponent 
                      initialLocation={{
                        lat: report.location.lat,
                        lng: report.location.lng
                      }}
                      readOnly={true}
                      showControls={false}
                    />
                  </div>
                </Card>
              </div>
              
              {/* Details */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p>{report.description}</p>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <MapPin size={18} className="text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-muted-foreground">
                            {report.location.address}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Clock size={18} className="text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Reported On</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(report.reported_at)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <User size={18} className="text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Reported By</div>
                          <div className="text-sm text-muted-foreground">
                            {report.reported_by === user?.id ? 'You' : report.reported_by}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp size={16} className="text-primary" />
                          <span>{report.votes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare size={16} className="text-primary" />
                          <span>{report.comments}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {isOwner && (
                    <CardFooter className="flex-col space-y-2 pt-4">
                      <div className="text-sm font-medium">Update Status:</div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={report.status === "active" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange("active")}
                          disabled={report.status === "active"}
                        >
                          Active
                        </Button>
                        <Button 
                          variant={report.status === "investigating" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange("investigating")}
                          disabled={report.status === "investigating"}
                        >
                          Investigating
                        </Button>
                        <Button 
                          variant={report.status === "resolved" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange("resolved")}
                          disabled={report.status === "resolved"}
                        >
                          Resolved
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
                
                {report.image_url && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={report.image_url} 
                          alt="Hazard" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
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
