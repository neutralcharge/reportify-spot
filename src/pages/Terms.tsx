
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <FileText size={24} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>
            
            <div className="text-sm text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            
            <div className="prose prose-blue max-w-none">
              <p>
                These Terms of Service ("Terms") govern your access to and use of SafetySpot's website, 
                mobile application, and services. Please read these Terms carefully before using our services.
              </p>
              
              <h2>1. Acceptance of Terms</h2>
              
              <p>
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree 
                to these Terms, you may not access or use the services.
              </p>
              
              <h2>2. Description of Service</h2>
              
              <p>
                SafetySpot provides a platform for users to report and track public hazards in their communities. 
                Our services include features for submitting hazard reports, viewing reports submitted by others, 
                receiving updates on hazard status, and communicating with other users about local safety issues.
              </p>
              
              <h2>3. User Accounts</h2>
              
              <p>
                To use certain features of our services, you must create an account. You agree to provide accurate, 
                current, and complete information and to update this information to keep it accurate, current, and complete.
              </p>
              
              <p>
                You are responsible for safeguarding your password and for all activities that occur under your account. 
                You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2>4. User Content</h2>
              
              <p>
                Our services allow you to submit content, including hazard reports, comments, and profile information. 
                You retain ownership rights in your content, but by submitting content, you grant us a worldwide, non-exclusive, 
                royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content 
                in connection with the services.
              </p>
              
              <p>
                You represent and warrant that:
              </p>
              
              <ul>
                <li>You own or have the necessary rights to the content you submit</li>
                <li>Your content is accurate and not misleading</li>
                <li>Your content does not violate these Terms, applicable law, or the rights of any third party</li>
              </ul>
              
              <p>
                We reserve the right to remove any content that violates these Terms or that we find objectionable.
              </p>
              
              <h2>5. Prohibited Conduct</h2>
              
              <p>
                You agree not to:
              </p>
              
              <ul>
                <li>Use the services for any illegal purpose or in violation of any laws</li>
                <li>Submit false or misleading information</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Interfere with or disrupt the services</li>
                <li>Attempt to gain unauthorized access to the services</li>
                <li>Use the services to distribute unsolicited promotional content</li>
                <li>Use the services to transmit any viruses or other harmful code</li>
              </ul>
              
              <h2>6. Limitation of Liability</h2>
              
              <p>
                To the maximum extent permitted by law, SafetySpot and its officers, employees, directors, 
                shareholders, parents, subsidiaries, affiliates, agents, and licensors will not be liable for 
                any indirect, incidental, special, consequential, or punitive damages, including without limitation,
                loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or 
                use of or inability to access or use the services.
              </p>
              
              <h2>7. Changes to Terms</h2>
              
              <p>
                We may modify these Terms at any time. If we make changes, we will provide notice of such changes, 
                such as by sending an email, providing a notice through our services, or updating the date at the 
                top of these Terms. Your continued use of the services following notification of changes confirms 
                your acceptance of our updated Terms.
              </p>
              
              <h2>8. Termination</h2>
              
              <p>
                We may terminate or suspend your access to the services at any time and for any reason without 
                notice. Upon termination, your right to use the services will immediately cease.
              </p>
              
              <h2>9. Contact Information</h2>
              
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              
              <p>
                Email: terms@safetyspot.com<br />
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

export default Terms;
