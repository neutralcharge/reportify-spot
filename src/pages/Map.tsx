
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  AlertCircle, 
  Filter, 
  Plus, 
  List, 
  MapPin, 
  Grid,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapComponent from "@/components/MapComponent";
import HazardCard, { Hazard, HazardType } from "@/components/HazardCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for hazards
const mockHazards: Hazard[] = [
  {
    id: "1",
    type: "pothole",
    description: "Large pothole in the middle of the road",
    location: {
      address: "123 Main Street, Cityville",
      lat: 40.7128,
      lng: -74.006,
    },
    reportedBy: "John Doe",
    reportedAt: "2023-09-15T10:30:00Z",
    status: "active",
    votes: 15,
    comments: 5,
    image: "https://images.unsplash.com/photo-1621951789295-9a8ad311cf1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "2",
    type: "waterlogging",
    description: "Water accumulation after rain",
    location: {
      address: "456 Park Avenue, Cityville",
      lat: 40.7135,
      lng: -74.009,
    },
    reportedBy: "Jane Smith",
    reportedAt: "2023-09-14T08:15:00Z",
    status: "investigating",
    votes: 8,
    comments: 3,
    image: "https://images.unsplash.com/photo-1578897366546-18d6bf0a2724?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "3",
    type: "other",
    description: "Fallen tree blocking sidewalk",
    location: {
      address: "789 Broadway, Cityville",
      lat: 40.7140,
      lng: -74.003,
    },
    reportedBy: "Samuel Johnson",
    reportedAt: "2023-09-13T15:45:00Z",
    status: "resolved",
    votes: 12,
    comments: 7,
    image: "https://images.unsplash.com/photo-1590691566921-aa78c29022a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "4",
    type: "pothole",
    description: "Multiple potholes on road",
    location: {
      address: "101 Liberty Street, Cityville",
      lat: 40.7120,
      lng: -74.001,
    },
    reportedBy: "Emma Wilson",
    reportedAt: "2023-09-12T09:20:00Z",
    status: "active",
    votes: 20,
    comments: 12,
  },
  {
    id: "5",
    type: "waterlogging",
    description: "Flooded underpass after heavy rain",
    location: {
      address: "202 Warren Street, Cityville",
      lat: 40.7115,
      lng: -74.008,
    },
    reportedBy: "Michael Brown",
    reportedAt: "2023-09-11T14:10:00Z",
    status: "investigating",
    votes: 30,
    comments: 15,
    image: "https://images.unsplash.com/photo-1600451683128-846d1c9d735c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
];

const MapPage = () => {
  const [filteredHazards, setFilteredHazards] = useState<Hazard[]>(mockHazards);
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    types: HazardType[];
    statuses: string[];
  }>({
    types: ["pothole", "waterlogging", "other"],
    statuses: ["active", "investigating", "resolved"],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Filter hazards based on selected filters
    const filtered = mockHazards.filter(
      (hazard) =>
        selectedFilters.types.includes(hazard.type) &&
        selectedFilters.statuses.includes(hazard.status)
    );
    setFilteredHazards(filtered);
  }, [selectedFilters]);

  const handleHazardSelect = (hazard: Hazard) => {
    setSelectedHazard(hazard);
    setIsDetailsOpen(true);
  };

  const handleTypeFilterChange = (type: HazardType) => {
    setSelectedFilters((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedFilters((prev) => {
      const statuses = prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status];
      return { ...prev, statuses };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-16 pt-6 sm:px-6 animate-fade-in">
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Hazard Map</h1>
          <p className="text-muted-foreground">
            View and filter reported hazards in your area
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 h-[600px] rounded-xl overflow-hidden border border-border">
            <MapComponent 
              hazards={filteredHazards} 
              onMarkerClick={handleHazardSelect}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">Hazards</h2>
                <Badge variant="outline">{filteredHazards.length}</Badge>
              </div>

              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter size={16} className="mr-2" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <div className="font-medium mb-1">Type</div>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.types.includes("pothole")}
                        onCheckedChange={() => handleTypeFilterChange("pothole")}
                      >
                        Potholes
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.types.includes("waterlogging")}
                        onCheckedChange={() =>
                          handleTypeFilterChange("waterlogging")
                        }
                      >
                        Water Logging
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.types.includes("other")}
                        onCheckedChange={() => handleTypeFilterChange("other")}
                      >
                        Other
                      </DropdownMenuCheckboxItem>
                    </div>
                    <div className="p-2 border-t">
                      <div className="font-medium mb-1">Status</div>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.statuses.includes("active")}
                        onCheckedChange={() => handleStatusFilterChange("active")}
                      >
                        Active
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.statuses.includes(
                          "investigating"
                        )}
                        onCheckedChange={() =>
                          handleStatusFilterChange("investigating")
                        }
                      >
                        Investigating
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.statuses.includes("resolved")}
                        onCheckedChange={() =>
                          handleStatusFilterChange("resolved")
                        }
                      >
                        Resolved
                      </DropdownMenuCheckboxItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="border divide-x rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`overflow-y-auto pr-2 pb-2 scrollbar-thin ${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
                  : "space-y-4"
              }`}
              style={{ maxHeight: "600px" }}
            >
              {filteredHazards.length > 0 ? (
                filteredHazards.map((hazard) => (
                  <HazardCard
                    key={hazard.id}
                    hazard={hazard}
                    onViewDetails={() => handleHazardSelect(hazard)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed h-full min-h-[200px]">
                  <AlertCircle size={40} className="text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No hazards found</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    There are no hazards matching your current filters
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedFilters({
                        types: ["pothole", "waterlogging", "other"],
                        statuses: ["active", "investigating", "resolved"],
                      })
                    }
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6">
              <Button asChild className="w-full" size="lg">
                <Link to="/report">
                  <Plus size={18} className="mr-2" />
                  Report New Hazard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Hazard Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedHazard && (
            <>
              <DialogHeader>
                <DialogTitle>Hazard Details</DialogTitle>
                <DialogDescription>
                  View complete information about this reported hazard
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-2">
                <div className="flex items-center space-x-2">
                  <Badge className={`${
                    selectedHazard.type === "pothole" 
                      ? "bg-hazard-pothole text-white" 
                      : selectedHazard.type === "waterlogging" 
                        ? "bg-hazard-waterlogging text-white" 
                        : "bg-hazard-other text-white"
                  }`}>
                    {selectedHazard.type.charAt(0).toUpperCase() + selectedHazard.type.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={`
                    ${selectedHazard.status === "active" 
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                      : selectedHazard.status === "resolved" 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    } px-2 py-0.5 text-xs uppercase`
                  }>
                    {selectedHazard.status}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-medium">{selectedHazard.description}</h3>
                
                {selectedHazard.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedHazard.image} 
                      alt={selectedHazard.description}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="flex items-center mt-1">
                          <MapPin size={14} className="text-primary mr-1" />
                          <span>{selectedHazard.location.address}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Reported By</div>
                        <div className="mt-1">{selectedHazard.reportedBy}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Reported On</div>
                        <div className="mt-1">
                          {new Date(selectedHazard.reportedAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="pt-2">
                  <Button className="w-full">Contact Local Authority</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Fixed Report Button for Mobile */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-10">
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" asChild>
            <Link to="/report">
              <Plus size={24} />
            </Link>
          </Button>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default MapPage;
