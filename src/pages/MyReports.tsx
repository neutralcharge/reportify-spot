
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const MyReports = () => {
  // Mock data - will be replaced with actual data from Supabase
  const [reports, setReports] = useState([
    {
      id: "1",
      title: "Large pothole on Main Street",
      description: "Deep pothole approximately 2 feet wide near the intersection with Oak Avenue",
      location: "123 Main St, Anytown",
      status: "active",
      category: "pothole",
      date: "2023-06-15",
      upvotes: 12
    },
    {
      id: "2",
      title: "Water logging after rainfall",
      description: "Persistent water accumulation blocking pedestrian access during rainy days",
      location: "45 Park Lane, Anytown",
      status: "investigating",
      category: "waterlogging",
      date: "2023-07-02",
      upvotes: 8
    },
    {
      id: "3",
      title: "Broken street light",
      description: "Street light not functioning for over a week creating darkness in the area",
      location: "78 Pine Road, Anytown",
      status: "resolved",
      category: "other",
      date: "2023-05-20",
      upvotes: 5
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>;
      case "investigating":
        return <Badge variant="warning" className="bg-amber-500">Investigating</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pothole":
        return <div className="w-8 h-8 rounded-full bg-hazard-pothole/10 flex items-center justify-center"><AlertTriangle size={16} className="text-hazard-pothole" /></div>;
      case "waterlogging":
        return <div className="w-8 h-8 rounded-full bg-hazard-waterlogging/10 flex items-center justify-center"><AlertTriangle size={16} className="text-hazard-waterlogging" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-hazard-other/10 flex items-center justify-center"><AlertTriangle size={16} className="text-hazard-other" /></div>;
    }
  };

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
              
              <TabsContent value="all">
                <div className="space-y-6">
                  {reports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-start space-y-0 gap-4 pb-2">
                        {getCategoryIcon(report.category)}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{report.title}</CardTitle>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>Reported on {new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{report.description}</p>
                        <div className="flex items-center text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>{report.location}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-gray-50 px-6 py-3 justify-between">
                        <div className="flex items-center space-x-1 text-sm">
                          <Button variant="ghost" size="sm" className="h-8">
                            <CheckCircle size={14} className="mr-1" /> 
                            <span>Upvoted by {report.upvotes} people</span>
                          </Button>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active">
                <div className="space-y-6">
                  {reports.filter(r => r.status === "active").map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      {/* Same card content structure as above */}
                      <CardHeader className="flex flex-row items-start space-y-0 gap-4 pb-2">
                        {getCategoryIcon(report.category)}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{report.title}</CardTitle>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>Reported on {new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{report.description}</p>
                        <div className="flex items-center text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>{report.location}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-gray-50 px-6 py-3 justify-between">
                        <div className="flex items-center space-x-1 text-sm">
                          <Button variant="ghost" size="sm" className="h-8">
                            <CheckCircle size={14} className="mr-1" /> 
                            <span>Upvoted by {report.upvotes} people</span>
                          </Button>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="investigating">
                <div className="space-y-6">
                  {reports.filter(r => r.status === "investigating").map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      {/* Same card content structure as above */}
                      <CardHeader className="flex flex-row items-start space-y-0 gap-4 pb-2">
                        {getCategoryIcon(report.category)}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{report.title}</CardTitle>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>Reported on {new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{report.description}</p>
                        <div className="flex items-center text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>{report.location}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-gray-50 px-6 py-3 justify-between">
                        <div className="flex items-center space-x-1 text-sm">
                          <Button variant="ghost" size="sm" className="h-8">
                            <CheckCircle size={14} className="mr-1" /> 
                            <span>Upvoted by {report.upvotes} people</span>
                          </Button>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resolved">
                <div className="space-y-6">
                  {reports.filter(r => r.status === "resolved").map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      {/* Same card content structure as above */}
                      <CardHeader className="flex flex-row items-start space-y-0 gap-4 pb-2">
                        {getCategoryIcon(report.category)}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{report.title}</CardTitle>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>Reported on {new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{report.description}</p>
                        <div className="flex items-center text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>{report.location}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-gray-50 px-6 py-3 justify-between">
                        <div className="flex items-center space-x-1 text-sm">
                          <Button variant="ghost" size="sm" className="h-8">
                            <CheckCircle size={14} className="mr-1" /> 
                            <span>Upvoted by {report.upvotes} people</span>
                          </Button>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyReports;
