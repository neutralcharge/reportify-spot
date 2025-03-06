
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getHazardReportById, voteHazardReport } from "@/services/hazardService";
import { HazardReport, HazardStatus } from "@/types/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, ThumbsUp, MapPin, Calendar, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const getStatusBadge = (status: HazardStatus) => {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Active</Badge>;
    case "investigating":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Investigating</Badge>;
    case "resolved":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "pothole":
      return <div className="h-10 w-10 rounded-full bg-hazard-pothole/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-hazard-pothole" /></div>;
    case "waterlogging":
      return <div className="h-10 w-10 rounded-full bg-hazard-waterlogging/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-hazard-waterlogging" /></div>;
    default:
      return <div className="h-10 w-10 rounded-full bg-hazard-other/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-hazard-other" /></div>;
  }
};

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  
  // Fetch hazard report details
  const { data: report, isLoading, error, refetch } = useQuery({
    queryKey: ['hazardReport', id],
    queryFn: () => getHazardReportById(id || ''),
    enabled: !!id,
  });
  
  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Handle upvote action
  const handleUpvote = async () => {
    if (!user || !report) return;
    
    try {
      const voted = await voteHazardReport(report.id, user.id);
      setHasVoted(voted);
      
      if (voted) {
        toast.success("Upvoted successfully!");
      } else {
        toast.info("Upvote removed");
      }
      
      // Refresh report data
      refetch();
    } catch (error) {
      console.error("Error upvoting report:", error);
      toast.error("Failed to process upvote");
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">Loading report details...</span>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6" 
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b">
              <div className="flex items-center gap-4">
                {getTypeIcon(report.type)}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={`${
                      report.type === "pothole" 
                        ? "bg-hazard-pothole text-white" 
                        : report.type === "waterlogging" 
                          ? "bg-hazard-waterlogging text-white" 
                          : "bg-hazard-other text-white"
                    }`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </Badge>
                    {getStatusBadge(report.status)}
                  </div>
                  <h1 className="text-2xl font-bold">{report.description}</h1>
                </div>
              </div>
            </div>
            
            {/* Image (if available) */}
            {report.image_url && (
              <div className="border-b">
                <img 
                  src={report.image_url} 
                  alt={report.description}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
            
            {/* Details */}
            <div className="p-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-muted-foreground">{report.location.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Reported On</h3>
                        <p className="text-muted-foreground">
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
                      <User className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Reported By</h3>
                        <p className="text-muted-foreground">
                          {report.reported_by === user?.id ? "You" : "Another User"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <ThumbsUp className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Upvotes</h3>
                        <p className="text-muted-foreground">{report.votes} upvotes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium">Description</h3>
                <p>{report.description}</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={handleUpvote}
                className={hasVoted ? "bg-primary/10" : ""}
              >
                <ThumbsUp className={`mr-2 h-4 w-4 ${hasVoted ? "fill-primary" : ""}`} />
                {hasVoted ? "Upvoted" : "Upvote"}
              </Button>
              
              {report.reported_by === user?.id && (
                <Button variant="default">
                  Contact Authority
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportDetails;
