
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Shield size={24} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
            
            <div className="text-sm text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            
            <div className="prose prose-blue max-w-none">
              <p>
                At SafetySpot, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our website and mobile application.
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                please do not access the site.
              </p>
              
              <h2>Information We Collect</h2>
              
              <p>
                We collect information that you provide directly to us when you:
              </p>
              
              <ul>
                <li>Register for an account</li>
                <li>Create or modify your profile</li>
                <li>Report hazards</li>
                <li>Interact with other users</li>
                <li>Contact customer support</li>
                <li>Respond to surveys or communications</li>
              </ul>
              
              <p>
                The types of information we may collect include:
              </p>
              
              <ul>
                <li>Name, email address, password, and other contact information</li>
                <li>Profile information such as your photo, address, and preferences</li>
                <li>Location data when you report hazards</li>
                <li>Information about the hazards you report</li>
                <li>Your interactions with the platform, including upvotes and comments</li>
                <li>Device information and usage data</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              
              <p>
                We use the information we collect for various purposes, including to:
              </p>
              
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process and display your hazard reports</li>
                <li>Send notifications about updates to your reports</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent security incidents</li>
                <li>Personalize and improve your experience</li>
              </ul>
              
              <h2>Sharing of Information</h2>
              
              <p>
                We may share information about you as follows:
              </p>
              
              <ul>
                <li>With other users, when you report hazards (your name and profile information may be visible)</li>
                <li>With vendors, consultants, and service providers who need access to such information to perform services for us</li>
                <li>In response to a request for information if we believe disclosure is in accordance with applicable law</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies</li>
                <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition</li>
                <li>With your consent or at your direction</li>
              </ul>
              
              <h2>Your Choices</h2>
              
              <p>
                Account Information: You may update, correct, or delete your account information at any time by logging into your account. If you wish to delete your account, please contact us.
              </p>
              
              <p>
                Location Information: You can prevent us from collecting location information by disabling location services on your device, but this may limit your ability to use certain features.
              </p>
              
              <p>
                Promotional Communications: You may opt out of receiving promotional emails by following the instructions in those emails. If you opt out, we may still send you non-promotional communications.
              </p>
              
              <h2>Contact Us</h2>
              
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              
              <p>
                Email: privacy@safetyspot.com<br />
                Address: 123 Safety Street, Anytown, USA
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
