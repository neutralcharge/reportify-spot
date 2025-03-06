
import React from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  category: string;
  date: string;
  upvotes: number;
  isSelected?: boolean;
}

interface ReportCardProps {
  report: Report;
  onViewDetails?: (id: string) => void;
  isSelected?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="destructive">Active</Badge>;
    case "investigating":
      return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600">Investigating</Badge>;
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

const ReportCard: React.FC<ReportCardProps> = ({ report, onViewDetails, isSelected }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(report.id);
    } else {
      navigate(`/my-reports/${report.id}`);
    }
  };
  
  return (
    <Card key={report.id} className={`overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary scale-[1.02]' : ''}`}>
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
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8" 
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
