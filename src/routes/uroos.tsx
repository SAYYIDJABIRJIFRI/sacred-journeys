import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { UROOS_MONTHS, SOURCE_URL } from "@/data/uroos";
import { Card } from "@/components/ui/card";
import { CalendarDays, ExternalLink } from "lucide-react";

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

function UroosPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            Hijri Calendar
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            ഉറൂസ് കലണ്ടർ
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            ഹിജ്റ വർഷത്തിലെ ഓരോ മാസത്തിലെയും ഉറൂസ് ദിനങ്ങളും ബന്ധപ്പെട്ട മഹാന്മാരുടെ വിശദാംശങ്ങളും.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {UROOS_MONTHS.map((m) => (
            <Card key={m.num} className="p-6 transition-shadow hover:shadow-elegant">
              <div className="mb-4 flex items-baseline justify-between border-b border-border pb-3">
                <h2 className="font-display text-xl font-semibold">
                  {m.num}. {m.name}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {m.days.reduce((n, d) => n + d.entries.length, 0)} entries
                </span>
              </div>

              {m.days.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  വിവരങ്ങൾ ലഭ്യമല്ല
                </p>
              ) : (
                <ul className="space-y-3">
                  {m.days.map((d) => (
                    <li key={d.day} className="flex gap-3">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full gradient-hero text-xs font-semibold text-primary-foreground">
                        {d.day}
                      </span>
                      <div className="flex-1 space-y-1">
                        {d.entries.map((e, i) =>
                          e.url ? (
                            <a
                              key={i}
                              href={e.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-start gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              <span>{e.text}</span>
                              <ExternalLink className="mt-0.5 h-3 w-3 opacity-0 group-hover:opacity-70 transition-opacity" />
                            </a>
                          ) : (
                            <span key={i} className="block text-sm text-foreground">
                              {e.text}
                            </span>
                          ),
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
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
