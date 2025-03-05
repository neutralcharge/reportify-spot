
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Locate, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Hazard, HazardType } from "./HazardCard";

// For now, we'll use a mock implementation without Mapbox
// In a real implementation, we would use mapbox-gl

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface MapComponentProps {
  hazards?: Hazard[];
  onSelectLocation?: (location: Location) => void;
  onMarkerClick?: (hazard: Hazard) => void;
  showControls?: boolean;
  readOnly?: boolean;
  initialLocation?: { lat: number; lng: number };
}

const MapComponent: React.FC<MapComponentProps> = ({
  hazards = [],
  onSelectLocation,
  onMarkerClick,
  showControls = true,
  readOnly = false,
  initialLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // In a real implementation, we would reverse geocode to get the address
        // For now, we'll use the coordinates as the address
        const location = {
          lat: latitude,
          lng: longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        };
        
        setCurrentLocation(location);
        
        if (onSelectLocation) {
          onSelectLocation(location);
        }
        
        toast.success("Location fetched successfully");
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to retrieve your location. Please check your location permissions.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Mock function for handling map clicks
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    
    // In a real implementation, we would get the coordinates from the map click
    // For now, we'll use random coordinates near the user's location or a default
    const base = currentLocation || { lat: 40.7128, lng: -74.006 };
    const randomLat = base.lat + (Math.random() - 0.5) * 0.01;
    const randomLng = base.lng + (Math.random() - 0.5) * 0.01;
    
    const location = {
      lat: randomLat,
      lng: randomLng,
      address: `${randomLat.toFixed(6)}, ${randomLng.toFixed(6)}`,
    };
    
    if (onSelectLocation) {
      onSelectLocation(location);
    }
    
    toast.info("Location selected (simulated)");
  };

  const getHazardPinColor = (type: HazardType) => {
    switch (type) {
      case "pothole":
        return "bg-hazard-pothole";
      case "waterlogging":
        return "bg-hazard-waterlogging";
      case "other":
        return "bg-hazard-other";
      default:
        return "bg-muted";
    }
  };

  useEffect(() => {
    // In a real implementation, we would initialize the map here
    console.log("Initializing map component");
    
    // If initialLocation is provided, use it
    if (initialLocation) {
      setCurrentLocation({
        ...initialLocation,
        address: `${initialLocation.lat.toFixed(6)}, ${initialLocation.lng.toFixed(6)}`,
      });
    }
  }, [initialLocation]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border">
      {/* Mock map container */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 bg-blue-50"
        onClick={handleMapClick}
      >
        {/* Placeholder map background - in a real implementation, this would be the actual map */}
        <div className="h-full w-full flex items-center justify-center flex-col">
          <div className="glass-panel p-4 rounded-lg max-w-md text-center mb-10">
            <h3 className="text-lg font-medium mb-2">Interactive Map</h3>
            <p className="text-sm text-muted-foreground">
              {readOnly 
                ? "This map shows reported hazards in your area." 
                : "Click on the map to select a location or use the locate button to use your current location."}
            </p>
          </div>
          
          {/* Mock hazard markers */}
          {hazards.map((hazard) => (
            <div 
              key={hazard.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-pulse-slow"
              style={{ 
                top: `${(Math.random() * 70) + 10}%`, 
                left: `${(Math.random() * 70) + 10}%` 
              }}
              onClick={() => onMarkerClick && onMarkerClick(hazard)}
            >
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${getHazardPinColor(hazard.type)} mb-1`} />
                <MapPin size={22} className={`${hazard.type === 'pothole' ? 'text-hazard-pothole' : hazard.type === 'waterlogging' ? 'text-hazard-waterlogging' : 'text-hazard-other'}`} />
              </div>
            </div>
          ))}
          
          {/* User's current location marker */}
          {currentLocation && (
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"
                 style={{ top: '50%', left: '50%' }}>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary mb-1" />
                <MapPin size={24} className="text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={getUserLocation}
            disabled={isLoading}
            className="shadow-md"
          >
            {isLoading ? (
              <span className="animate-spin">
                <Locate size={18} />
              </span>
            ) : (
              <Locate size={18} />
            )}
          </Button>
        </div>
      )}
      
      {/* Map attribution - would be replaced with actual Mapbox attribution */}
      <div className="absolute bottom-1 right-1 bg-white/80 px-2 py-1 rounded text-xs text-muted-foreground">
        Map data © SafetySpot
      </div>
    </div>
  );
};

export default MapComponent;
