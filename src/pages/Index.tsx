import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-4xl px-4 animate-fade-up">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Hazard Hunter</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help keep your community safe by reporting public hazards with automatic detection technology
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4 mt-8">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg"
            onClick={() => navigate("/report")}
          >
            Report a Hazard
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg"
            onClick={() => navigate("/map")}
          >
            View Hazard Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
