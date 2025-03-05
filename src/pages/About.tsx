
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Users, MapPin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 bg-blue-50">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                About SafetySpot
              </h1>
              <p className="text-lg text-muted-foreground">
                Our mission is to create safer communities by empowering citizens to report and
                track public hazards.
              </p>
            </div>
            
            <div className="prose prose-blue max-w-3xl mx-auto">
              <p className="text-lg">
                SafetySpot was founded in 2023 with a simple idea: what if everyone could
                easily report dangerous conditions in their neighborhood and track when they
                get fixed?
              </p>
              
              <p>
                Our platform connects concerned citizens with local authorities to streamline
                the process of identifying and resolving public hazards like potholes, water
                logging, broken street lights, and more.
              </p>
              
              <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Our Values</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Safety First</h3>
                  <p className="text-muted-foreground">
                    We believe everyone deserves to live in a safe environment with well-maintained infrastructure.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Community Powered</h3>
                  <p className="text-muted-foreground">
                    When communities work together, we can create positive change faster than any individual effort.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Local Focus</h3>
                  <p className="text-muted-foreground">
                    We work at the neighborhood level, connecting residents with the resources they need locally.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-12 mb-6 text-center">How It Works</h2>
              
              <ol className="space-y-6 mt-8">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-medium text-lg">Report a Hazard</h3>
                    <p>Use our simple form to submit details about the hazard you've spotted. Our system will automatically detect your location or you can specify it manually.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-medium text-lg">Community Verification</h3>
                    <p>Other users can confirm the hazard exists, helping to prioritize the most pressing issues.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-medium text-lg">Track Progress</h3>
                    <p>Follow the status of reported hazards from submission through to resolution. Get notified when there are updates.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-medium text-lg">Community Impact</h3>
                    <p>See statistics on how many issues have been resolved in your area and the impact you've helped create.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
