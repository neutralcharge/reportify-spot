
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle, Eye } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-90"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 25px 25px, #f1f5f9 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="container relative z-10 px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
          <div className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-blue-100 text-blue-800 animate-fade-in">
            <AlertCircle size={16} className="mr-2" />
            <span className="text-sm font-medium">Together for safer communities</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Report hazards, <br />
            <span className="text-primary">keep your community safe</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Join our community-driven platform to report and track public hazards like potholes and water logging in your area. Together, we can create safer streets and neighborhoods.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="h-12 px-6 shadow-lg">
              <Link to="/report">
                <MapPin size={18} className="mr-2" />
                Report a Hazard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6 bg-white">
              <Link to="/map">
                <Eye size={18} className="mr-2" />
                View Hazard Map
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center p-4 rounded-lg bg-white shadow-sm">
              <div className="font-bold text-2xl text-primary mb-1">250+</div>
              <div className="text-sm text-muted-foreground">Hazards Reported</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white shadow-sm">
              <div className="font-bold text-2xl text-primary mb-1">120+</div>
              <div className="text-sm text-muted-foreground">Issues Resolved</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white shadow-sm">
              <div className="font-bold text-2xl text-primary mb-1">5K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-5/12 relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-100 rounded-full opacity-70"></div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-green-100 rounded-full opacity-60"></div>
            
            {/* Main image */}
            <div className="relative z-10 bg-white p-3 rounded-xl shadow-xl">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Community safety" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -left-8 top-1/3 p-4 bg-white rounded-lg shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-hazard-pothole flex items-center justify-center">
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Pothole reported</div>
                  <div className="text-xs text-muted-foreground">2 min ago</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-6 -bottom-4 p-4 bg-white rounded-lg shadow-lg animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-hazard-waterlogging flex items-center justify-center">
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Waterlogging fixed</div>
                  <div className="text-xs text-muted-foreground">5 min ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
