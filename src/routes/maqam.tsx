import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  MAQAMS,
  REGION_LABELS,
  CATEGORY_LABELS,
  type Maqam,
  type MaqamRegion,
  type MaqamCategory,
} from "@/data/maqams";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  ExternalLink,
  Building2,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/maqam")({
  head: () => ({
    meta: [
      { title: "Maqam Directory — Ziyarath" },
      {
        name: "description",
        content:
          "A directory of revered maqams and dargahs across Kerala, India, and the wider Muslim world. Filter by region and category to plan your ziyarath.",
      },
      { property: "og:title", content: "Maqam Directory — Ziyarath" },
      {
        property: "og:description",
        content:
          "Explore maqams and dargahs by region and category — Kerala, India, Middle East and beyond.",
      },
      { property: "og:url", content: "/maqam" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/maqam" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Maqam Directory",
          itemListElement: MAQAMS.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: m.name,
            description: m.description,
          })),
        }),
      },
    ],
  }),
  component: MaqamPage,
});

const REGIONS: MaqamRegion[] = ["kerala", "india", "middle-east", "worldwide"];
const CATEGORIES: MaqamCategory[] = [
  "sufi",
  "scholar",
  "sahaba",
  "shaheed",
  "prophet",
];

function MaqamPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<MaqamRegion | "all">("all");
  const [category, setCategory] = useState<MaqamCategory | "all">("all");
  const [selected, setSelected] = useState<Maqam | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MAQAMS.filter((m) => {
      if (region !== "all" && m.region !== region) return false;
      if (category !== "all" && m.category !== category) return false;
      if (!q) return true;
      return [
        m.name,
        m.malayalamName,
        m.location,
        m.city,
        m.country,
        m.description,
      ]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [query, region, category]);

  const counts = useMemo(() => {
    const r: Record<string, number> = { all: MAQAMS.length };
    for (const m of MAQAMS) r[m.region] = (r[m.region] ?? 0) + 1;
    return r;
  }, []);

  const hasFilters = region !== "all" || category !== "all" || query.length > 0;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Ziyarath Directory</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Maqam &amp; Dargah Directory
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Discover sacred resting places of the awliya, scholars and companions —
            from Malabar to Madina. Filter by region or category to plan your next
            ziyarath.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, city or country…"
                className="h-11 pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip active={region === "all"} onClick={() => setRegion("all")}>
                All regions
                <span className="ml-1 text-xs opacity-70">{counts.all}</span>
              </Chip>
              {REGIONS.map((r) => (
                <Chip
                  key={r}
                  active={region === r}
                  onClick={() => setRegion(r)}
                >
                  {REGION_LABELS[r]}
                  {counts[r] ? (
                    <span className="ml-1 text-xs opacity-70">{counts[r]}</span>
                  ) : null}
                </Chip>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip
                small
                active={category === "all"}
                onClick={() => setCategory("all")}
              >
                All types
              </Chip>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  small
                  active={category === c}
                  onClick={() => setCategory(c)}
                >
                  {CATEGORY_LABELS[c]}
                </Chip>
              ))}
              {hasFilters && (
                <button
                  onClick={() => {
                    setQuery("");
                    setRegion("all");
                    setCategory("all");
                  }}
                  className="inline-flex min-h-9 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-medium text-muted-foreground hover:bg-accent"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filtered.length} of {MAQAMS.length} maqams
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground">
              No maqams match these filters. Try clearing them.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="text-left"
              >
                <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold leading-snug">
                        {m.name}
                      </h3>
                      {m.malayalamName && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {m.malayalamName}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {CATEGORY_LABELS[m.category]}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="break-words">
                      {m.city}, {m.country}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm text-foreground/80">
                    {m.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="outline">{REGION_LABELS[m.region]}</Badge>
                    {m.era && (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {m.era}
                      </span>
                    )}
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[selected.category]}
                  </Badge>
                  <Badge variant="outline">
                    {REGION_LABELS[selected.region]}
                  </Badge>
                  {selected.era && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" /> {selected.era}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="break-words font-display text-xl sm:text-2xl">
                  {selected.name}
                </DialogTitle>
                {selected.malayalamName && (
                  <DialogDescription className="text-base">
                    {selected.malayalamName}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="break-words">
                    <div className="text-foreground">{selected.location}</div>
                    <div>
                      {selected.city}, {selected.country}
                    </div>
                  </div>
                </div>

                <p className="leading-relaxed text-foreground/90">
                  {selected.description}
                </p>

                {selected.significance && (
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Significance
                    </div>
                    <p className="text-foreground/90">{selected.significance}</p>
                  </div>
                )}

                {selected.bestTimeToVisit && (
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <span className="font-medium">Best time: </span>
                      <span className="text-muted-foreground">
                        {selected.bestTimeToVisit}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                {selected.sourceUrl && (
                  <a
                    href={selected.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="h-4 w-4" /> Source
                    </Button>
                  </a>
                )}
                <Button onClick={() => setSelected(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}

function Chip({
  active,
  small,
  onClick,
  children,
}: {
  active?: boolean;
  small?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border transition-colors",
        small ? "min-h-8 px-3 text-xs" : "min-h-9 px-4 text-sm",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}
