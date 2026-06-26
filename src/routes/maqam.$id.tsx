import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  MAQAMS,
  REGION_LABELS,
  CATEGORY_LABELS,
  type Maqam,
} from "@/data/maqams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Building2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";

function findMaqam(id: string): Maqam | undefined {
  return MAQAMS.find((m) => m.id === id);
}

export const Route = createFileRoute("/maqam/$id")({
  loader: ({ params }) => {
    const maqam = findMaqam(params.id);
    if (!maqam) throw notFound();
    return { maqam };
  },
  head: ({ loaderData, params }) => {
    const m = loaderData?.maqam;
    if (!m) {
      return {
        meta: [{ title: "Maqam not found — Ziyarath" }],
      };
    }
    const title = `${m.name} — Ziyarath`;
    const description = m.description.slice(0, 155);
    const url = `/maqam/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            name: m.name,
            alternateName: m.malayalamName,
            description: m.description,
            address: {
              "@type": "PostalAddress",
              addressLocality: m.city,
              addressCountry: m.country,
            },
            additionalType: "https://schema.org/LandmarksOrHistoricalBuildings",
            isAccessibleForFree: true,
            ...(m.sourceUrl ? { sameAs: [m.sourceUrl] } : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Maqam Directory",
                item: "/maqam",
              },
              { "@type": "ListItem", position: 3, name: m.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Maqam not found</h1>
        <p className="mt-3 text-muted-foreground">
          We could not find that maqam in our directory.
        </p>
        <Link to="/maqam" className="mt-6 inline-block">
          <Button>Back to directory</Button>
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </SiteLayout>
  ),
  component: MaqamDetailPage,
});

function MaqamDetailPage() {
  const { maqam: m } = Route.useLoaderData() as { maqam: Maqam };
  const related: Maqam[] = MAQAMS.filter(
    (x) => x.id !== m.id && (x.region === m.region || x.category === m.category),
  ).slice(0, 3);

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/maqam">Maqam</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{m.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{CATEGORY_LABELS[m.category]}</Badge>
          <Badge variant="outline">{REGION_LABELS[m.region]}</Badge>
          {m.era && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" /> {m.era}
            </Badge>
          )}
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {m.name}
        </h1>
        {m.malayalamName && (
          <p className="mt-2 text-lg text-muted-foreground">{m.malayalamName}</p>
        )}

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-start gap-2 text-muted-foreground">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="break-words">
              <div className="text-foreground">{m.location}</div>
              <div>
                {m.city}, {m.country}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <a
              className="text-primary hover:underline"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${m.name} ${m.city} ${m.country}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps
            </a>
          </div>
        </div>

        <p className="mt-8 text-base leading-relaxed text-foreground/90 sm:text-lg">
          {m.description}
        </p>

        {m.significance && (
          <Card className="mt-6 p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Significance
            </div>
            <p className="mt-2 leading-relaxed text-foreground/90">
              {m.significance}
            </p>
          </Card>
        )}

        {m.bestTimeToVisit && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="text-sm">
              <span className="font-semibold">Best time to visit: </span>
              <span className="text-muted-foreground">{m.bestTimeToVisit}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/maqam">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to directory
            </Button>
          </Link>
          {m.sourceUrl && (
            <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" /> Source
              </Button>
            </a>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold">Related maqams</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/maqam/$id"
                  params={{ id: r.id }}
                  className="block"
                >
                  <Card className="h-full p-4 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-display font-semibold">{r.name}</div>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {CATEGORY_LABELS[r.category]}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.city}, {r.country}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}
