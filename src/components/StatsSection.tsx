
import { CheckCircle, Clock, Map } from "lucide-react";

const StatsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Making real impact in our communities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform has helped identify and resolve hundreds of public hazards, making neighborhoods safer for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-8 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Map size={32} className="text-primary" />
            </div>
            <div className="text-4xl sm:text-5xl font-bold mb-2">250+</div>
            <div className="text-muted-foreground text-center">Hazards Reported</div>
          </div>
          
          <div className="flex flex-col items-center p-8 bg-green-50 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <div className="text-4xl sm:text-5xl font-bold mb-2">120+</div>
            <div className="text-muted-foreground text-center">Issues Resolved</div>
          </div>
          
          <div className="flex flex-col items-center p-8 bg-amber-50 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
              <Clock size={32} className="text-amber-500" />
            </div>
            <div className="text-4xl sm:text-5xl font-bold mb-2">48hrs</div>
            <div className="text-muted-foreground text-center">Average Response Time</div>
          </div>
        </div>
        
        <div className="mt-16">
          <div className="p-8 bg-blue-50 rounded-lg">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">Most Reported Hazards</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Potholes</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div className="bg-hazard-pothole h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Water Logging</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div className="bg-hazard-waterlogging h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Other Hazards</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div className="bg-hazard-other h-2.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
