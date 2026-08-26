export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const CROPS = ["Paddy", "Wheat", "Cotton", "Maize", "Sugarcane"] as const;

export const CATEGORIES = [
  { value: "small", label: "Small & Marginal (<2 ha)" },
  { value: "medium", label: "Medium (2-10 ha)" },
  { value: "large", label: "Large (>10 ha)" },
] as const;

export type EligibilityRule = { rule: string; passed: boolean };

export type Scheme = {
  id: string;
  title: string;
  category: string;
  status: string;
  land_limit: string | null;
  summary: string;
  grant_value: number;
  portal_url: string | null;
  eligibility_rules: EligibilityRule[];
  documents: string[];
};

export const STATUS_META: Record<
  string,
  { label: string; dot: string; className: string }
> = {
  eligible: {
    label: "Eligible",
    dot: "🟢",
    className: "bg-success/15 text-success border-success/30",
  },
  likely: {
    label: "Likely Match",
    dot: "🟡",
    className: "bg-warning/25 text-warning-foreground border-warning/50",
  },
  potential: {
    label: "Potential",
    dot: "🔵",
    className: "bg-info/15 text-info border-info/30",
  },
};

export function formatINR(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}
