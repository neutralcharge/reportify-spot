
import { AlertCircle, MapPin, Calendar, MessageSquare } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type HazardType = "pothole" | "waterlogging" | "other";

export interface Hazard {
  id: string;
  type: HazardType;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  reportedBy: string;
  reportedAt: string;
  status: "active" | "resolved" | "investigating";
  votes: number;
  comments: number;
  image?: string;
}

interface HazardCardProps {
  hazard: Hazard;
  onViewDetails?: (id: string) => void;
}

const getHazardColor = (type: HazardType) => {
  switch (type) {
    case "pothole":
      return "bg-hazard-pothole text-white";
    case "waterlogging":
      return "bg-hazard-waterlogging text-white";
    case "other":
      return "bg-hazard-other text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "investigating":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const HazardCard: React.FC<HazardCardProps> = ({ hazard, onViewDetails }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className={`h-1.5 ${getHazardColor(hazard.type)}`} />
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Badge variant="outline" className={`${getStatusColor(hazard.status)} px-2 py-0.5 text-xs uppercase`}>
              {hazard.status}
            </Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onViewDetails && onViewDetails(hazard.id)}
                >
                  <AlertCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge className={`${getHazardColor(hazard.type)}`}>
                {hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)}
              </Badge>
              <h3 className="font-medium text-base">{hazard.description}</h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{hazard.location.address}</span>
            </div>
          </div>
          
          {hazard.image && (
            <div className="relative h-48 w-full overflow-hidden rounded-md">
              <img 
                src={hazard.image} 
                alt={hazard.description}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(hazard.reportedAt)}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <MessageSquare size={14} className="mr-1" />
            {hazard.comments}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HazardCard;
