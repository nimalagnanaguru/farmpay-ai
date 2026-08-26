import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Leaf, LayoutGrid, MessageCircle, User } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmerProfileTab } from "@/components/farmpay/FarmerProfileTab";
import { SchemeDashboardTab } from "@/components/farmpay/SchemeDashboardTab";
import { ChatTab } from "@/components/farmpay/ChatTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FarmPay AI — Government Scheme Assistant for Farmers" },
      {
        name: "description",
        content:
          "Find Indian government agriculture schemes you qualify for. Build a farmer profile, see matched subsidies with eligibility checks and document lists, and ask the AI assistant.",
      },
      { property: "og:title", content: "FarmPay AI — Government Scheme Assistant" },
      {
        property: "og:description",
        content:
          "Match your farm profile to PM-KISAN, PMFBY, PM-KUSUM and more — with eligibility rules, document checklists and an AI scheme assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState("profile");

  return (
    <main className="min-h-screen bg-background">
      <header className="field-grad px-4 py-5 text-primary-foreground">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Leaf className="size-5" />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">FarmPay AI</h1>
            <p className="text-xs opacity-85">Government Scheme Assistant</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-10 pt-4">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-xl bg-secondary p-1">
            <TabsTrigger value="profile" className="gap-1.5 rounded-lg text-xs sm:text-sm">
              <User className="size-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="schemes" className="gap-1.5 rounded-lg text-xs sm:text-sm">
              <LayoutGrid className="size-4" /> Schemes
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-1.5 rounded-lg text-xs sm:text-sm">
              <MessageCircle className="size-4" /> Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <FarmerProfileTab onSaved={() => setTab("schemes")} />
          </TabsContent>
          <TabsContent value="schemes" className="mt-4">
            <SchemeDashboardTab />
          </TabsContent>
          <TabsContent value="chat" className="mt-4">
            <ChatTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
