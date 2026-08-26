import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeIndianRupee,
  CheckCircle2,
  ExternalLink,
  FileText,
  HelpCircle,
  Layers,
  Loader2,
  Ruler,
  XCircle,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatINR, STATUS_META, type Scheme } from "@/lib/farmpay";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "eligible", label: "🟢 Eligible" },
  { value: "likely", label: "🟡 Likely Match" },
  { value: "potential", label: "🔵 Potential" },
];

export function SchemeDashboardTab() {
  const [filter, setFilter] = useState("all");
  const [why, setWhy] = useState<Scheme | null>(null);
  const [docs, setDocs] = useState<Scheme | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["schemes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .order("grant_value", { ascending: false });
      if (error) throw error;
      return data as unknown as Scheme[];
    },
  });

  const schemes = useMemo(() => data ?? [], [data]);
  const shown = schemes.filter((s) => filter === "all" || s.status === filter);
  const highCount = schemes.filter((s) => s.status === "eligible").length;
  const totalValue = schemes.reduce((sum, s) => sum + Number(s.grant_value), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 rounded-2xl field-grad p-4 text-primary-foreground">
        <Stat icon={<Layers className="size-4" />} value={String(schemes.length)} label="Matched" />
        <Stat
          icon={<CheckCircle2 className="size-4" />}
          value={String(highCount)}
          label="High eligibility"
        />
        <Stat
          icon={<BadgeIndianRupee className="size-4" />}
          value={formatINR(totalValue)}
          label="Grant value"
        />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((scheme) => {
            const meta = STATUS_META[scheme.status] ?? STATUS_META["potential"]!;
            return (
              <Card key={scheme.id} className="border-border/70 shadow-sm">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-tight">{scheme.title}</h3>
                    <Badge variant="outline" className={cn("shrink-0", meta.className)}>
                      {meta.dot} {meta.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{scheme.category}</Badge>
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Ruler className="size-3" />
                      {scheme.land_limit ?? "No limit"}
                    </Badge>
                    <Badge variant="outline" className="gap-1 border-accent/40 text-accent">
                      <BadgeIndianRupee className="size-3" />
                      {formatINR(Number(scheme.grant_value))}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{scheme.summary}</p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => setWhy(scheme)}>
                      <HelpCircle className="size-4" /> Why Match?
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDocs(scheme)}>
                      <FileText className="size-4" /> Documents
                    </Button>
                    <Button size="sm" className="ml-auto" asChild>
                      <a
                        href={scheme.portal_url ?? "#"}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Apply <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {shown.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No schemes in this filter.
            </p>
          )}
        </div>
      )}

      <Dialog open={!!why} onOpenChange={(open) => !open && setWhy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why this match?</DialogTitle>
            <DialogDescription>{why?.title}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2">
            {why?.eligibility_rules?.map((rule) => (
              <li
                key={rule.rule}
                className="flex items-start gap-2 rounded-lg border border-border bg-surface p-3 text-sm"
              >
                {rule.passed ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                )}
                <span className={rule.passed ? "" : "text-muted-foreground"}>{rule.rule}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <Dialog open={!!docs} onOpenChange={(open) => !open && setDocs(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document checklist</DialogTitle>
            <DialogDescription>{docs?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {docs?.documents?.map((doc, i) => (
              <label
                key={doc}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm"
              >
                <Checkbox defaultChecked={i === 0} />
                {doc}
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 opacity-80">{icon}</div>
      <p className="text-lg font-bold leading-tight">{value}</p>
      <p className="text-[11px] leading-tight opacity-80">{label}</p>
    </div>
  );
}
