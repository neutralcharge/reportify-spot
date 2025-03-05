
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportsList from "@/components/ReportsList";
import { mockReports } from "@/data/mockReports";
import { Report } from "@/components/ReportCard";

const MyReports = () => {
  // Mock data - will be replaced with actual data from Supabase
  const [reports, setReports] = useState<Report[]>(mockReports);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">My Reports</h1>
            <p className="text-muted-foreground mb-8">Track the status of hazards you've reported</p>
            
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyReports;
