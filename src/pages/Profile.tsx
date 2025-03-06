import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import  {supabase}  from "../lib/supabase";
// Initialize Supabase client

const Profile = () => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notifications: {
      email: false,
      push: false,
      sms: false,
    }
  });

  // Fetch user and profile data
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (user) {
          setUser(user);
          
          // Get the user's profile from the profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          
          // Get notification preferences (assuming they are stored in user metadata)
          const notifications = user.user_metadata?.notifications || {
            email: false,
            push: false,
            sms: false
          };
          
          // Set the profile and form data
          setProfile(profile || {});
          setFormData({
            name: profile?.full_name || user.user_metadata?.full_name || "",
            email: user.email || "",
            phone: profile?.phone || user.user_metadata?.phone || "",
            address: profile?.address || user.user_metadata?.address || "",
            notifications
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndProfile();
  }, [toast]);

  // Handle input changes for profile fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle notification preference changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [name]: checked
      }
    });
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          updated_at: new Date()
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update user metadata including notifications
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          notifications: formData.notifications
        }
      });
      
      if (userError) throw userError;
      
      // Fetch the updated profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setProfile(updatedProfile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('current-password');
    const newPassword = formData.get('new-password');
    const confirmPassword = formData.get('confirm-password');
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Password updated successfully"
      });
      
      // Clear the form
      e.target.reset();
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle saving notification preferences
  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      
      // Update user metadata with notification preferences
      const { error } = await supabase.auth.updateUser({
        data: {
          notifications: formData.notifications
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Notification preferences updated"
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 bg-gray-50 flex items-center justify-center">
          <p>Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-6">
                <User size={30} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{formData.name || "Your Profile"}</h1>
                <p className="text-muted-foreground">Manage your account and settings</p>
              </div>
            </div>

            <Tabs defaultValue="profile">
              <TabsList className="mb-8">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Manage your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-gray-50" : ""}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              readOnly
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-gray-50" : ""}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-gray-50" : ""}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                          {isEditing ? (
                            <>
                              <Button 
                                variant="outline" 
                                type="button"
                                onClick={() => {
                                  setIsEditing(false);
                                  setFormData({
                                    name: profile?.full_name || user?.user_metadata?.full_name || "",
                                    email: user?.email || "",
                                    phone: profile?.phone || user?.user_metadata?.phone || "",
                                    address: profile?.address || user?.user_metadata?.address || "",
                                    notifications: user?.user_metadata?.notifications || {
                                      email: false,
                                      push: false,
                                      sms: false
                                    }
                                  });
                                }}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                              </Button>
                            </>
                          ) : (
                            <Button 
                              type="button" 
                              onClick={() => setIsEditing(true)}
                            >
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveNotifications(); }}>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell size={18} />
                              <Label htmlFor="email-notifications">Email Notifications</Label>
                            </div>
                            <input
                              type="checkbox"
                              id="email-notifications"
                              name="email"
                              checked={formData.notifications.email}
                              onChange={handleNotificationChange}
                              className="h-4 w-4"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell size={18} />
                              <Label htmlFor="push-notifications">Push Notifications</Label>
                            </div>
                            <input
                              type="checkbox"
                              id="push-notifications"
                              name="push"
                              checked={formData.notifications.push}
                              onChange={handleNotificationChange}
                              className="h-4 w-4"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell size={18} />
                              <Label htmlFor="sms-notifications">SMS Notifications</Label>
                            </div>
                            <input
                              type="checkbox"
                              id="sms-notifications"
                              name="sms"
                              checked={formData.notifications.sms}
                              onChange={handleNotificationChange}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Preferences"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordUpdate}>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            name="current-password" 
                            type="password" 
                            required 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            name="new-password" 
                            type="password" 
                            required 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            name="confirm-password" 
                            type="password" 
                            required 
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;