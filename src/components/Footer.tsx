
import { MapPin, Mail, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-12 mt-auto">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <AlertCircle size={18} className="text-primary-foreground" />
              </div>
              <span className="text-lg font-medium">SafetySpot</span>
            </Link>
            <p className="text-muted-foreground text-sm mt-4 max-w-xs">
              Help create safer communities by reporting and tracking public hazards in your area.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Hazard Map
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Report Hazard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  My Reports
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-muted-foreground text-sm">
                <MapPin size={16} className="mr-2" /> 123 Safety Street, Cityville
              </li>
              <li className="flex items-center text-muted-foreground text-sm">
                <Mail size={16} className="mr-2" /> contact@safetyspot.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SafetySpot. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
