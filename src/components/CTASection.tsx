
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-primary to-blue-600 p-8 sm:p-12 text-white relative">
            {/* Abstract shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -mb-10 -ml-10"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                    Make a difference in your community today
                  </h2>
                  <p className="text-blue-100 mb-6 max-w-2xl">
                    Join thousands of community members who are already making their neighborhoods safer. Report hazards, track fixes, and be part of the solution.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-blue-50">
                      <Link to="/signup">
                        Join SafetySpot
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/20">
                      <Link to="/report">
                        <MapPin size={18} className="mr-2" />
                        Report a Hazard
                      </Link>
                    </Button>
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

export default CTASection;
