import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { UROOS_MONTHS, SOURCE_URL, type UroosMonth } from "@/data/uroos";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ExternalLink,
  Search,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/uroos")({
  head: () => ({
    meta: [
      { title: "ഉറൂസ് കലണ്ടർ — Ziyarath" },
      {
        name: "description",
        content:
          "ഹിജ്റ വർഷത്തിലെ ഓരോ മാസത്തിലെയും ഉറൂസ് ദിനങ്ങളും മഹാന്മാരുടെ വിശദാംശങ്ങളും.",
      },
      { property: "og:title", content: "ഉറൂസ് കലണ്ടർ — Ziyarath" },
      {
        property: "og:description",
        content:
          "ഹിജ്റ വർഷത്തിലെ ഓരോ മാസത്തിലെയും ഉറൂസ് ദിനങ്ങളും മഹാന്മാരുടെ വിശദാംശങ്ങളും.",
      },
    ],
  }),
  component: UroosPage,
});

// Estimate current Hijri month (approximation — good enough for highlighting)
function currentHijriMonth(): number {
  const epoch = Date.UTC(622, 6, 16); // 16 July 622 CE — Hijri epoch
  const days = (Date.now() - epoch) / 86400000;
  const hYear = Math.floor((days * 30) / 10631) + 1;
  const yearStart = epoch + Math.floor(((hYear - 1) * 10631) / 30) * 86400000;
  const dayOfYear = Math.floor((Date.now() - yearStart) / 86400000);
  // 12 months alternating 30/29 days
  let acc = 0;
  for (let m = 1; m <= 12; m++) {
    acc += m % 2 === 1 ? 30 : 29;
    if (dayOfYear < acc) return m;
  }
  return 12;
}

type Flat = { month: UroosMonth; day: number; text: string; url: string | null };

function flatten(months: UroosMonth[]): Flat[] {
  const out: Flat[] = [];
  for (const m of months) {
    for (const d of m.days) {
      for (const e of d.entries) {
        out.push({ month: m, day: d.day, text: e.text, url: e.url });
      }
    }
  }
  return out;
}

function UroosPage() {
  const hijri = useMemo(currentHijriMonth, []);
  const [active, setActive] = useState<number | "all">(hijri);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "timeline">("grid");

  const all = useMemo(() => flatten(UROOS_MONTHS), []);
  const totalEntries = all.length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((f) => {
      if (active !== "all" && f.month.num !== active) return false;
      if (!q) return true;
      return (
        f.text.toLowerCase().includes(q) ||
        f.month.name.toLowerCase().includes(q)
      );
    });
  }, [all, active, query]);

  const monthsToRender = useMemo(() => {
    if (active === "all") return UROOS_MONTHS;
    return UROOS_MONTHS.filter((m) => m.num === active);
  }, [active]);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <CalendarDays className="h-3.5 w-3.5" />
            Hijri Calendar · {totalEntries} entries
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight">
            ഉറൂസ് കലണ്ടർ
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            ഹിജ്റ വർഷത്തിലെ ഓരോ മാസത്തിലെയും ഉറൂസ് ദിനങ്ങളും ബന്ധപ്പെട്ട മഹാന്മാരുടെ
            വിശദാംശങ്ങളും.
          </p>

          {/* Search + view toggle */}
          <div className="mt-8 mx-auto flex max-w-xl flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="തിരയുക — പേര്, സ്ഥലം, മാസം..."
                className="pl-9 pr-9 h-11 bg-card"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="inline-flex rounded-md border border-border bg-card p-1">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                onClick={() => setView("timeline")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "timeline"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="h-3.5 w-3.5" /> Timeline
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Month chip nav */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
            <ChipButton
              active={active === "all"}
              onClick={() => setActive("all")}
              label="എല്ലാം"
              count={totalEntries}
            />
            {UROOS_MONTHS.map((m) => {
              const count = m.days.reduce((n, d) => n + d.entries.length, 0);
              return (
                <ChipButton
                  key={m.num}
                  active={active === m.num}
                  onClick={() => setActive(m.num)}
                  label={m.name}
                  count={count}
                  highlight={m.num === hijri}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {query && (
          <p className="mb-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            results for "{query}"
          </p>
        )}

        {filtered.length === 0 ? (
          <EmptyState onReset={() => { setQuery(""); setActive("all"); }} />
        ) : view === "grid" ? (
          <GridView months={monthsToRender} query={query} hijri={hijri} />
        ) : (
          <TimelineView entries={filtered} />
        )}

        <p className="mt-14 text-center text-xs text-muted-foreground">
          ഉറവിടം:{" "}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            ziyarathinfo.wordpress.com
          </a>
        </p>
      </section>
    </SiteLayout>
  );
}

function ChipButton({
  active,
  onClick,
  label,
  count,
  highlight,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary",
      )}
    >
      {highlight && !active && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--gold,oklch(0.78_0.14_85))] ring-2 ring-background" />
      )}
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
          active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function highlightText(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--gold,oklch(0.85_0.14_85))]/40 text-foreground rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function GridView({
  months,
  query,
  hijri,
}: {
  months: UroosMonth[];
  query: string;
  hijri: number;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {months.map((m) => {
        const count = m.days.reduce((n, d) => n + d.entries.length, 0);
        const isCurrent = m.num === hijri;
        return (
          <Card
            key={m.num}
            className={cn(
              "group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant",
              isCurrent && "ring-2 ring-primary/40",
            )}
          >
            {isCurrent && (
              <div className="absolute top-3 right-3">
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3" /> Now
                </Badge>
              </div>
            )}
            <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
              <span className="font-display text-3xl font-semibold text-primary/70 tabular-nums">
                {String(m.num).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold leading-tight">
                  {m.name}
                </h2>
                <p className="text-xs text-muted-foreground">{count} entries</p>
              </div>
            </div>

            {m.days.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4 text-center">
                വിവരങ്ങൾ ലഭ്യമല്ല
              </p>
            ) : (
              <ul className="space-y-3.5">
                {m.days.map((d) => (
                  <li key={d.day} className="flex gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary tabular-nums">
                      {d.day}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      {d.entries.map((e, i) =>
                        e.url ? (
                          <a
                            key={i}
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-start gap-1.5 text-sm leading-snug text-foreground hover:text-primary transition-colors"
                          >
                            <span className="flex-1">
                              {highlightText(e.text, query)}
                            </span>
                            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-70 transition-opacity" />
                          </a>
                        ) : (
                          <span key={i} className="block text-sm leading-snug">
                            {highlightText(e.text, query)}
                          </span>
                        ),
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function TimelineView({ entries }: { entries: Flat[] }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
      <ul className="space-y-4">
        {entries.map((f, i) => (
          <li key={i} className="relative pl-12">
            <span className="absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold tabular-nums ring-4 ring-background">
              {f.day}
            </span>
            <Card className="p-4 transition-shadow hover:shadow-elegant">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-[10px]">
                  {f.month.num}. {f.month.name}
                </Badge>
              </div>
              {f.url ? (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{f.text}</span>
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-50" />
                </a>
              ) : (
                <span className="inline-flex items-start gap-1.5 text-sm font-medium">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {f.text}
                </span>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-muted">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold">No results found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a different search or browse all months.
      </p>
      <Button onClick={onReset} variant="outline" className="mt-5">
        Reset filters
      </Button>
    </div>
  );
}
