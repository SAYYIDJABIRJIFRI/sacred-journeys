import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { UROOS_MONTHS, SOURCE_URL, type UroosMonth } from "@/data/uroos";
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
  CalendarDays,
  ExternalLink,
  Search,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  X,
  Globe2,
  Building2,
  Hash,
  BookOpen,
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

/* ---------- helpers ---------- */

function currentHijriMonth(): number {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      month: "numeric",
    }).formatToParts(new Date());
    const m = parts.find((p) => p.type === "month")?.value;
    const n = m ? parseInt(m, 10) : NaN;
    if (n >= 1 && n <= 12) return n;
  } catch {
    /* fall through */
  }
  // Fallback approximation
  const epoch = Date.UTC(622, 6, 16);
  const days = (Date.now() - epoch) / 86400000;
  const hYear = Math.floor((days * 30) / 10631) + 1;
  const yearStart = epoch + Math.floor(((hYear - 1) * 10631) / 30) * 86400000;
  const dayOfYear = Math.floor((Date.now() - yearStart) / 86400000);
  let acc = 0;
  for (let m = 1; m <= 12; m++) {
    acc += m % 2 === 1 ? 30 : 29;
    if (dayOfYear < acc) return m;
  }
  return 12;
}

const KERALA_KEYWORDS = [
  "ചാലിയം",
  "പെരുമ്പടപ്പ്",
  "നൂഞ്ഞേരി",
  "അമ്പങ്കുന്ന്",
  "ചെറുവണ്ണൂര്",
  "വാളക്കുളം",
  "തട്ടാങ്ങര",
  "പടിഞ്ഞാറങ്ങാടി",
  "താനൂര്",
  "കോഴിക്കോട്",
  "എടപ്പാള്",
  "ഐലക്കാട്",
];

type Region = "kerala" | "worldwide";

function classifyRegion(text: string): Region {
  return KERALA_KEYWORDS.some((k) => text.includes(k)) ? "kerala" : "worldwide";
}

type Flat = {
  month: UroosMonth;
  day: number;
  text: string;
  url: string | null;
  region: Region;
};

function flatten(months: UroosMonth[]): Flat[] {
  const out: Flat[] = [];
  for (const m of months) {
    for (const d of m.days) {
      for (const e of d.entries) {
        out.push({
          month: m,
          day: d.day,
          text: e.text,
          url: e.url,
          region: classifyRegion(e.text),
        });
      }
    }
  }
  return out;
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

/* ---------- page ---------- */

function UroosPage() {
  const hijri = useMemo(currentHijriMonth, []);
  const [active, setActive] = useState<number | "all">(hijri);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const [region, setRegion] = useState<Region | "all">("all");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [detail, setDetail] = useState<Flat | null>(null);

  const all = useMemo(() => flatten(UROOS_MONTHS), []);
  const totalEntries = all.length;
  const keralaCount = all.filter((e) => e.region === "kerala").length;
  const worldCount = totalEntries - keralaCount;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((f) => {
      if (active !== "all" && f.month.num !== active) return false;
      if (region !== "all" && f.region !== region) return false;
      if (selectedDay !== null && f.day !== selectedDay) return false;
      if (!q) return true;
      return (
        f.text.toLowerCase().includes(q) ||
        f.month.name.toLowerCase().includes(q)
      );
    });
  }, [all, active, query, region, selectedDay]);

  // Month for the mini calendar (only meaningful when a single month is active)
  const activeMonth =
    active === "all" ? null : UROOS_MONTHS.find((m) => m.num === active) ?? null;

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
              onClick={() => {
                setActive("all");
                setSelectedDay(null);
              }}
              label="എല്ലാം"
              count={totalEntries}
            />
            {UROOS_MONTHS.map((m) => {
              const count = m.days.reduce((n, d) => n + d.entries.length, 0);
              return (
                <ChipButton
                  key={m.num}
                  active={active === m.num}
                  onClick={() => {
                    setActive(m.num);
                    setSelectedDay(null);
                  }}
                  label={m.name}
                  count={count}
                  highlight={m.num === hijri}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Region filter + mini calendar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Region
              </p>
              <div className="flex flex-wrap gap-2">
                <RegionChip
                  active={region === "all"}
                  onClick={() => setRegion("all")}
                  icon={<Hash className="h-3.5 w-3.5" />}
                  label="All"
                  count={totalEntries}
                />
                <RegionChip
                  active={region === "kerala"}
                  onClick={() => setRegion("kerala")}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  label="Kerala"
                  count={keralaCount}
                />
                <RegionChip
                  active={region === "worldwide"}
                  onClick={() => setRegion("worldwide")}
                  icon={<Globe2 className="h-3.5 w-3.5" />}
                  label="Worldwide"
                  count={worldCount}
                />
              </div>
            </div>

            {(selectedDay !== null || region !== "all" || query) && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">Active filters:</span>
                {selectedDay !== null && (
                  <FilterPill
                    onClear={() => setSelectedDay(null)}
                    label={`Day ${selectedDay}`}
                  />
                )}
                {region !== "all" && (
                  <FilterPill
                    onClear={() => setRegion("all")}
                    label={region === "kerala" ? "Kerala" : "Worldwide"}
                  />
                )}
                {query && (
                  <FilterPill onClear={() => setQuery("")} label={`"${query}"`} />
                )}
              </div>
            )}
          </div>

          {/* Mini calendar */}
          {activeMonth ? (
            <MiniCalendar
              month={activeMonth}
              selectedDay={selectedDay}
              onSelectDay={(d) => setSelectedDay(d === selectedDay ? null : d)}
            />
          ) : (
            <Card className="p-5 text-center text-sm text-muted-foreground">
              <CalendarDays className="mx-auto mb-2 h-5 w-5" />
              Pick a month above to see the day grid.
            </Card>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "entry" : "entries"}
          {query && <> for "{query}"</>}
        </p>

        {filtered.length === 0 ? (
          <EmptyState
            onReset={() => {
              setQuery("");
              setActive("all");
              setRegion("all");
              setSelectedDay(null);
            }}
          />
        ) : view === "grid" ? (
          <GridView
            entries={filtered}
            months={
              active === "all"
                ? UROOS_MONTHS
                : UROOS_MONTHS.filter((m) => m.num === active)
            }
            query={query}
            hijri={hijri}
            onOpen={setDetail}
          />
        ) : (
          <TimelineView entries={filtered} onOpen={setDetail} />
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

      <EntryDialog entry={detail} onClose={() => setDetail(null)} />
    </SiteLayout>
  );
}

/* ---------- subcomponents ---------- */

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

function RegionChip({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card hover:border-primary/40 hover:text-primary",
      )}
    >
      {icon}
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

function FilterPill({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
      {label}
      <button
        onClick={onClear}
        className="rounded-full p-0.5 hover:bg-primary/20"
        aria-label="Remove filter"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function MiniCalendar({
  month,
  selectedDay,
  onSelectDay,
}: {
  month: UroosMonth;
  selectedDay: number | null;
  onSelectDay: (d: number) => void;
}) {
  const totalDays = month.num % 2 === 1 ? 30 : 29;
  const dayMap = new Map<number, number>();
  for (const d of month.days) dayMap.set(d.day, d.entries.length);

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-sm font-semibold">
          {month.num}. {month.name}
        </h3>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Tap a day
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
          const count = dayMap.get(d) ?? 0;
          const has = count > 0;
          const isSel = selectedDay === d;
          return (
            <button
              key={d}
              onClick={() => has && onSelectDay(d)}
              disabled={!has}
              title={has ? `${count} entries` : "No entries"}
              className={cn(
                "relative aspect-square rounded-md text-[11px] font-medium tabular-nums transition-all",
                isSel
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : has
                    ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    : "bg-muted/50 text-muted-foreground/40 cursor-not-allowed",
              )}
            >
              {d}
              {has && !isSel && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      {selectedDay !== null && (
        <button
          onClick={() => onSelectDay(selectedDay)}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-primary"
        >
          Clear day filter
        </button>
      )}
    </Card>
  );
}

function GridView({
  entries,
  months,
  query,
  hijri,
  onOpen,
}: {
  entries: Flat[];
  months: UroosMonth[];
  query: string;
  hijri: number;
  onOpen: (f: Flat) => void;
}) {
  // Re-bucket filtered entries back into their months/days
  const byMonth = new Map<number, Map<number, Flat[]>>();
  for (const e of entries) {
    if (!byMonth.has(e.month.num)) byMonth.set(e.month.num, new Map());
    const dMap = byMonth.get(e.month.num)!;
    if (!dMap.has(e.day)) dMap.set(e.day, []);
    dMap.get(e.day)!.push(e);
  }

  const visibleMonths = months.filter((m) => byMonth.has(m.num));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {visibleMonths.map((m) => {
        const dMap = byMonth.get(m.num)!;
        const days = Array.from(dMap.keys()).sort((a, b) => a - b);
        const count = days.reduce((n, d) => n + dMap.get(d)!.length, 0);
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

            <ul className="space-y-3.5">
              {days.map((day) => (
                <li key={day} className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary tabular-nums">
                    {day}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    {dMap.get(day)!.map((e, i) => (
                      <button
                        key={i}
                        onClick={() => onOpen(e)}
                        className="group/link flex w-full items-start gap-1.5 text-left text-sm leading-snug text-foreground hover:text-primary transition-colors"
                      >
                        <span className="flex-1">{highlightText(e.text, query)}</span>
                        <RegionDot region={e.region} />
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}

function TimelineView({
  entries,
  onOpen,
}: {
  entries: Flat[];
  onOpen: (f: Flat) => void;
}) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
      <ul className="space-y-4">
        {entries.map((f, i) => (
          <li key={i} className="relative pl-12">
            <span className="absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold tabular-nums ring-4 ring-background">
              {f.day}
            </span>
            <button
              onClick={() => onOpen(f)}
              className="block w-full text-left"
            >
              <Card className="p-4 transition-shadow hover:shadow-elegant">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {f.month.num}. {f.month.name}
                  </Badge>
                  <RegionBadge region={f.region} />
                </div>
                <span className="inline-flex items-start gap-1.5 text-sm font-medium">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {f.text}
                </span>
              </Card>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RegionDot({ region }: { region: Region }) {
  return (
    <span
      title={region === "kerala" ? "Kerala" : "Worldwide"}
      className={cn(
        "mt-1 h-2 w-2 shrink-0 rounded-full",
        region === "kerala" ? "bg-primary" : "bg-[var(--gold,oklch(0.78_0.14_85))]",
      )}
    />
  );
}

function RegionBadge({ region }: { region: Region }) {
  const isK = region === "kerala";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 text-[10px]",
        isK ? "border-primary/40 text-primary" : "border-border text-muted-foreground",
      )}
    >
      {isK ? <Building2 className="h-2.5 w-2.5" /> : <Globe2 className="h-2.5 w-2.5" />}
      {isK ? "Kerala" : "Worldwide"}
    </Badge>
  );
}

function EntryDialog({
  entry,
  onClose,
}: {
  entry: Flat | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={entry !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        {entry && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  Day {entry.day}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {entry.month.num}. {entry.month.name}
                </Badge>
                <RegionBadge region={entry.region} />
              </div>
              <DialogTitle className="mt-3 font-display text-2xl leading-tight">
                {entry.text}
              </DialogTitle>
              <DialogDescription>
                ഹിജ്റ {entry.month.name} {entry.day} ന് നടക്കുന്ന ഉറൂസ്.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <MetaRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Date"
                value={`${entry.month.name} ${entry.day}`}
              />
              <MetaRow
                icon={<MapPin className="h-4 w-4" />}
                label="Region"
                value={entry.region === "kerala" ? "Kerala" : "Worldwide"}
              />
              <MetaRow
                icon={<Hash className="h-4 w-4" />}
                label="Month no."
                value={String(entry.month.num)}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {entry.url && (
                <Button asChild>
                  <a href={entry.url} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="h-4 w-4" />
                    Read full details
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
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
