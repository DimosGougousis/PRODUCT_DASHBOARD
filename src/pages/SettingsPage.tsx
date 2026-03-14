import { useState } from 'react';
import { User, Bell, Palette, Shield, Link as LinkIcon, Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    defaultView: 'list',
    theme: 'system',
    notifications: {
      email: true,
      slack: false,
      browser: true,
    },
    features: {
      webSearch: true,
      aiInsights: true,
      autoSave: true,
      conflictDetection: true,
    },
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Alex" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Kim" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="alex.kim@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Senior Product Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue="Product Manager with 5+ years experience in e-commerce and fintech."
                  />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Customize how PRD Partner works for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default PRD View</Label>
                  <Select
                    value={preferences.defaultView}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, defaultView: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="kanban">Kanban Board</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Features</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">AI Insights</p>
                        <p className="text-xs text-gray-600">
                          Show AI recommendations and insights
                        </p>
                      </div>
                      <Switch
                        checked={preferences.features.aiInsights}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            features: { ...preferences.features, aiInsights: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Auto-Save</p>
                        <p className="text-xs text-gray-600">
                          Automatically save changes as you type
                        </p>
                      </div>
                      <Switch
                        checked={preferences.features.autoSave}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            features: { ...preferences.features, autoSave: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Conflict Detection</p>
                        <p className="text-xs text-gray-600">
                          Alert me when conflicts are detected
                        </p>
                      </div>
                      <Switch
                        checked={preferences.features.conflictDetection}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            features: { ...preferences.features, conflictDetection: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Web Search</p>
                        <p className="text-xs text-gray-600">
                          Allow AI to search the web for context
                        </p>
                      </div>
                      <Switch
                        checked={preferences.features.webSearch}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            features: { ...preferences.features, webSearch: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, email: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Slack Notifications</p>
                    <p className="text-sm text-gray-600">
                      Get alerts in Slack
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.slack}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, slack: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Browser Notifications</p>
                    <p className="text-sm text-gray-600">
                      Show desktop notifications
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.browser}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, browser: checked },
                      })
                    }
                  />
                </div>
                <Button onClick={handleSave}>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with your favorite tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <IntegrationItem
                  name="Slack"
                  description="Get notifications and updates in Slack"
                  connected={false}
                  icon="💬"
                />
                <IntegrationItem
                  name="Jira"
                  description="Sync PRDs with Jira tickets"
                  connected={false}
                  icon="🎯"
                />
                <IntegrationItem
                  name="Google Drive"
                  description="Export PRDs to Google Docs"
                  connected={true}
                  icon="📄"
                />
                <IntegrationItem
                  name="Confluence"
                  description="Publish PRDs to Confluence"
                  connected={false}
                  icon="📚"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About PRD Partner</CardTitle>
                <CardDescription>Version and system information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Version</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">January 2026</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform</span>
                    <span className="font-medium">Web</span>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Info className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function IntegrationItem({
  name,
  description,
  connected,
  icon,
}: {
  name: string;
  description: string;
  connected: boolean;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {connected ? (
        <Button variant="outline" size="sm">
          Disconnect
        </Button>
      ) : (
        <Button size="sm">Connect</Button>
      )}
    </div>
  );
}
