
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportsList from "@/components/ReportsList";
import { Report } from "@/components/ReportCard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserHazardReports } from "@/services/hazardService";
import { HazardReport } from "@/types/supabase";
import { AlertCircle, Loader2 } from "lucide-react";

// Transform database reports to UI report format
const transformToReport = (report: HazardReport): Report => {
  return {
    id: report.id,
    title: report.description.length > 60 
      ? report.description.substring(0, 60) + '...' 
      : report.description,
    description: report.description,
    location: report.location.address,
    status: report.status,
    category: report.type,
    date: report.reported_at,
    upvotes: report.votes
  };
};

const MyReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user's reports
  const { data: userReports, isLoading, error } = useQuery({
    queryKey: ['userReports', user?.id],
    queryFn: () => user ? getUserHazardReports(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  // Transform data to the format expected by ReportsList
  const reports: Report[] = userReports 
    ? userReports.map(transformToReport)
    : [];

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">My Reports</h1>
            <p className="text-muted-foreground mb-8">Track the status of hazards you've reported</p>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <p>Loading your reports...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-medium mb-2">Failed to load reports</h3>
                <p className="text-muted-foreground max-w-md">
                  There was a problem loading your reports. Please try again later.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList className="mb-8">
                  <TabsTrigger value="all">All Reports</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="investigating">Investigating</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                
                <ReportsList reports={reports} filter="all" />
                <ReportsList reports={reports} filter="active" />
                <ReportsList reports={reports} filter="investigating" />
                <ReportsList reports={reports} filter="resolved" />
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyReports;
