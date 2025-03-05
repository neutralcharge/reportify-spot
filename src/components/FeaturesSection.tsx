
import { 
  MapPin, AlertCircle, Users, Shield, Eye, 
  BellRing, Gauge, Smartphone 
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Location Based Reporting",
    description: "Easily report hazards with precise location tracking that automatically detects where you are."
  },
  {
    icon: AlertCircle,
    title: "Hazard Categories",
    description: "Categorize hazards as potholes, water logging, or other issues to help prioritize fixes."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a network of concerned citizens all working together to improve local infrastructure."
  },
  {
    icon: Eye,
    title: "Real-time Updates",
    description: "Get notifications when hazards in your area are reported or fixed."
  },
  {
    icon: BellRing,
    title: "Status Tracking",
    description: "Follow the progress of reported hazards from active to investigating to resolved."
  },
  {
    icon: Shield,
    title: "Verified Reports",
    description: "Our community verification system ensures reports are accurate and legitimate."
  },
  {
    icon: Gauge,
    title: "Priority System",
    description: "Critical hazards are highlighted and escalated based on severity and community input."
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Report hazards on the go with our fully responsive mobile experience."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Powerful features to keep your community safe</h2>
          <p className="text-lg text-muted-foreground">
            Our platform is designed with a focus on usability, efficiency, and community engagement.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-white rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 animate-fade-up"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
