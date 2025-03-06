import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Locate } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface MapComponentProps {
  initialLocation?: Location;
  onSelectLocation?: (location: Location) => void;
  showControls?: boolean;
  readOnly?: boolean;
  className?: string;
}

const MapComponent = ({
  initialLocation,
  onSelectLocation,
  showControls = true,
  readOnly = false,
  className
}: MapComponentProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(initialLocation || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Initialize the map when the component mounts
  useEffect(() => {
    const initMap = async () => {
      setIsLoading(true);
      
      // Check if Google Maps API is loaded
      if (!window.google?.maps) {
        console.error('Google Maps API not loaded');
        toast.error('Unable to load map. Please try again later.');
        setIsLoading(false);
        return;
      }

      try {
        // Default center (can be a central location in your target area)
        const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // New Delhi
        
        // Create the map
        const mapOptions: google.maps.MapOptions = {
          center: initialLocation ? 
            { lat: initialLocation.lat, lng: initialLocation.lng } : 
            defaultCenter,
          zoom: 15,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ saturation: -80 }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ lightness: 20 }]
            }
          ]
        };
        
        if (mapContainerRef.current) {
          mapRef.current = new window.google.maps.Map(
            mapContainerRef.current,
            mapOptions
          );
          
          // Create marker if initial location exists
          if (initialLocation) {
            createMarker(initialLocation);
          }
          
          // Add click event listener if not read-only
          if (!readOnly) {
            mapRef.current.addListener('click', handleMapClick);
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Unable to initialize map. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapRef.current && !readOnly) {
        // @ts-ignore
        window.google?.maps?.event.clearListeners(mapRef.current, 'click');
      }
      markerRef.current = null;
    };
  }, [initialLocation, readOnly]);

  // Handle map click to place a marker
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (readOnly || !mapRef.current || !e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    try {
      setIsLoading(true);
      // Reverse geocode the clicked location
      const address = await reverseGeocode(lat, lng);
      
      const location = { lat, lng, address };
      setCurrentLocation(location);
      createMarker(location);
      
      // Notify parent component
      if (onSelectLocation) {
        onSelectLocation(location);
      }
    } catch (error) {
      console.error('Error handling map click:', error);
      toast.error('Unable to get address for this location');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current device location
  const getCurrentLocation = () => {
    if (readOnly) return;
    
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Center the map on current location
          if (mapRef.current) {
            mapRef.current.setCenter({ lat, lng });
            mapRef.current.setZoom(17); // Zoom in closer
          }
          
          // Reverse geocode to get address
          const address = await reverseGeocode(lat, lng);
          
          const location = { lat, lng, address };
          setCurrentLocation(location);
          createMarker(location);
          
          // Notify parent component
          if (onSelectLocation) {
            onSelectLocation(location);
          }
          
          toast.success('Located your current position');
        } catch (error) {
          console.error('Error getting current location:', error);
          toast.error('Unable to get your current location address');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        toast.error(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.google?.maps) {
        reject('Google Maps API not loaded');
        return;
      }
      
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(`Geocoder failed: ${status}`);
          }
        }
      );
    });
  };

  // Create or update marker
  const createMarker = (location: Location) => {
    if (!mapRef.current) return;
    
    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    
    // Create new marker
    markerRef.current = new window.google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: mapRef.current,
      animation: window.google.maps.Animation.DROP,
      title: 'Selected Location'
    });
    
    // Optionally add an info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div class="p-2"><strong>Location</strong><br>${location.address}</div>`
    });
    
    markerRef.current.addListener('click', () => {
      infoWindow.open(mapRef.current, markerRef.current);
    });
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div 
        ref={mapContainerRef} 
        className="map-container"
        style={{ height: '100%', minHeight: '300px' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}
      
      {showControls && !readOnly && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="shadow-md"
            onClick={getCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Locate className="h-4 w-4 mr-2" />
            )}
            {isLocating ? 'Locating...' : 'My Location'}
          </Button>
        </div>
      )}
      
      {currentLocation && (
        <div className="absolute top-4 left-4 max-w-xs">
          <div className="glass-card p-2 text-xs rounded-md">
            <div className="font-medium mb-1">Selected Location</div>
            <div className="text-muted-foreground line-clamp-2">{currentLocation.address}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
