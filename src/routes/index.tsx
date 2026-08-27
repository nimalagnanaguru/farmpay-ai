import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Globe, Leaf, LayoutGrid, MessageCircle, User } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FarmerProfileTab } from "@/components/farmpay/FarmerProfileTab";
import { SchemeDashboardTab } from "@/components/farmpay/SchemeDashboardTab";
import { ChatTab } from "@/components/farmpay/ChatTab";
import { I18nProvider, LANGUAGES, useI18n, type LangCode } from "@/lib/i18n";
import type { PassportProfile } from "@/utils/pdfGenerator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FarmPay AI — Government Scheme Assistant for Farmers" },
      {
        name: "description",
        content:
          "Find Indian government agriculture schemes you qualify for in 6 languages. Build a farmer profile, see matched subsidies, and download a PDF Scheme Passport.",
      },
      { property: "og:title", content: "FarmPay AI — Government Scheme Assistant" },
      {
        property: "og:description",
        content:
          "Match your farm profile to PM-KISAN, PMFBY, PM-KUSUM and more — multilingual UI, eligibility rules, document checklists and a downloadable Scheme Passport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexRoute,
});

function IndexRoute() {
  return (
    <I18nProvider>
      <Index />
    </I18nProvider>
  );
}

const DEFAULT_PROFILE: PassportProfile = {
  fullName: "Ramesh Kumar",
  state: "Tamil Nadu",
  district: "Thanjavur",
  landholdingHa: 1.6,
  crops: ["Paddy", "Sugarcane"],
};

function Index() {
  const { t, lang, setLang } = useI18n();
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState<PassportProfile>(DEFAULT_PROFILE);

  return (
    <main className="min-h-screen bg-background">
      <header className="field-grad px-4 py-5 text-primary-foreground">
        <nav className="mx-auto flex max-w-3xl items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Leaf className="size-5" />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">{t("appTitle")}</h1>
            <p className="text-xs opacity-85">{t("appSubtitle")}</p>
          </div>

          <div className="ml-auto">
            <Select value={lang} onValueChange={(v) => setLang(v as LangCode)}>
              <SelectTrigger
                aria-label={t("language")}
                className="h-9 w-[132px] border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground"
              >
                <Globe className="size-4 opacity-80" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.native}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-10 pt-4">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-xl bg-secondary p-1">
            <TabsTrigger value="profile" className="gap-1.5 rounded-lg text-xs sm:text-sm">
              <User className="size-4" /> {t("tabProfile")}
            </TabsTrigger>
            <TabsTrigger value="schemes" className="gap-1.5 rounded-lg text-xs sm:text-sm">
              <LayoutGrid className="size-4" /> {t("tabSchemes")}
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-1.5 rounded-lg text-xs sm:text-sm">
              <MessageCircle className="size-4" /> {t("tabChat")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <FarmerProfileTab
              onSaved={(saved) => {
                setProfile(saved);
                setTab("schemes");
              }}
            />
          </TabsContent>
          <TabsContent value="schemes" className="mt-4">
            <SchemeDashboardTab profile={profile} />
          </TabsContent>
          <TabsContent value="chat" className="mt-4">
            <ChatTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
