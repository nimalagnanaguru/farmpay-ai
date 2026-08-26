import { useState } from "react";
import { toast } from "sonner";
import { Check, Droplets, Loader2, Sprout } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CATEGORIES, CROPS, INDIAN_STATES } from "@/lib/farmpay";

export function FarmerProfileTab({ onSaved }: { onSaved: () => void }) {
  const [fullName, setFullName] = useState("Ramesh Kumar");
  const [state, setState] = useState("Tamil Nadu");
  const [district, setDistrict] = useState("Thanjavur");
  const [land, setLand] = useState("1.6");
  const [category, setCategory] = useState("small");
  const [crops, setCrops] = useState<string[]>(["Paddy", "Sugarcane"]);
  const [irrigation, setIrrigation] = useState(true);
  const [saving, setSaving] = useState(false);

  const toggleCrop = (crop: string) =>
    setCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop],
    );

  const save = async () => {
    if (!fullName.trim() || !state) {
      toast.error("Please add your name and state.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("farmer_profiles").insert({
      full_name: fullName.trim(),
      state,
      district: district.trim(),
      landholding_ha: Number(land) || 0,
      category,
      primary_crops: crops,
      irrigation_access: irrigation,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save profile. Please try again.");
      return;
    }
    toast.success("Profile saved — matching schemes for you.");
    onSaved();
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sprout className="size-4 text-primary" />
            Farmer Profile
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tell us about your farm and we&apos;ll match government schemes for you.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Thanjavur"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="land">Landholding (hectares)</Label>
              <Input
                id="land"
                type="number"
                min="0"
                step="0.1"
                value={land}
                onChange={(e) => setLand(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Primary Crops</Label>
            <div className="flex flex-wrap gap-2">
              {CROPS.map((crop) => {
                const active = crops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => toggleCrop(crop)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {active && <Check className="size-3.5" />}
                    {crop}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <Droplets className="size-4 text-info" />
              <div>
                <p className="text-sm font-medium">Irrigation Access</p>
                <p className="text-xs text-muted-foreground">
                  Bore well, canal or assured water source
                </p>
              </div>
            </div>
            <Switch checked={irrigation} onCheckedChange={setIrrigation} />
          </div>

          <Button
            onClick={save}
            disabled={saving}
            className="h-12 w-full text-base font-semibold"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save &amp; Find Schemes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
