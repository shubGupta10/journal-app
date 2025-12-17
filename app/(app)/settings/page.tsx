 "use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProfileSettings from "./_components/ProfileSettings";
import AppearanceSettings from "./_components/AppearanceSettings";
import SecuritySettings from "./_components/SecuritySettings";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col gap-6">
      <section className="flex flex-col gap-2 pt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      </section>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="border-b border-border">
          <TabsList className="h-auto bg-transparent p-0 gap-6 border-none shadow-none">
            <TabsTrigger
              value="profile"
              className="relative rounded-none border-b-2 border-transparent px-0 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none bg-transparent shadow-none"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="relative rounded-none border-b-2 border-transparent px-0 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none bg-transparent shadow-none"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="relative rounded-none border-b-2 border-transparent px-0 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none bg-transparent shadow-none"
            >
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="space-y-6">
              <TabsContent value="profile" className="mt-0">
                <Card className="border border-border bg-card shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      Profile
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Update your personal information and how others see you across your journal.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ProfileSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="mt-0">
                <Card className="border border-border bg-card shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      Appearance
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Choose how your journal looks and feels in light or dark environments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <AppearanceSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card className="border border-border bg-card shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      Security
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Manage your password and account safety so your private thoughts stay private.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <SecuritySettings />
                  </CardContent>
                </Card>
              </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}


