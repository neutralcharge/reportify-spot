
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, User, Shield, Bell } from "lucide-react";

const Profile = () => {
  // Mock user data - will be replaced with actual user data from Supabase
  const [user, setUser] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    notifications: {
      email: true,
      push: true,
      sms: false,
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [name]: checked
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would save data to Supabase in the real implementation
    setUser(formData);
    setIsEditing(false);
  };

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
                <h1 className="text-3xl font-bold">{user.name}</h1>
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
                              value={isEditing ? formData.name : user.name}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={isEditing ? formData.email : user.email}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={isEditing ? formData.phone : user.phone}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={isEditing ? formData.address : user.address}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                          {isEditing ? (
                            <>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setIsEditing(false);
                                  setFormData({...user});
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </>
                          ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
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
                    <form>
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
                              checked={user.notifications.email}
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
                              checked={user.notifications.push}
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
                              checked={user.notifications.sms}
                              onChange={handleNotificationChange}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>Save Preferences</Button>
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
                    <form>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>Update Password</Button>
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
