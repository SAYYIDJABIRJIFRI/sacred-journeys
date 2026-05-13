import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { POSTS } from "@/data/posts";

const PAGE_SIZE = 6;

const searchSchema = z.object({
  page: fallback(z.number().int().min(1), 1).default(1),
});

export const Route = createFileRoute("/blog")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Blog — Ziyarath | Islamic Heritage Articles" },
      {
        name: "description",
        content:
          "Articles on Islamic history, Kerala heritage, sacred mosques, scholars and the etiquette of ziyarath.",
      },
      { property: "og:title", content: "Ziyarath Blog" },
      {
        property: "og:description",
        content: "Stories and history from Islamic heritage across the world.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { page } = Route.useSearch();
  const totalPages = Math.max(1, Math.ceil(POSTS.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = POSTS.slice(start, start + PAGE_SIZE);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Journal
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Stories of Faith, History &amp; Heritage
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Carefully researched articles on Islamic history, sacred places and the
            living traditions of the ummah.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post, i) => (
            <article
              key={post.slug}
              style={{ animationDelay: `${i * 100}ms` }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant animate-fade-up"
            >
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="block"
                aria-label={post.title}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                      {post.tag}
                    </span>
                    <time
                      dateTime={post.isoDate}
                      className="inline-flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" /> {post.date}
                    </time>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold leading-snug group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Read article{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="mt-12 flex items-center justify-center gap-2"
          >
            <Link
              to="/blog"
              search={{ page: Math.max(1, current - 1) }}
              aria-label="Previous page"
              aria-disabled={current === 1}
              className={`inline-flex h-10 items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground ${
                current === 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Link>

            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const active = n === current;
              return (
                <Link
                  key={n}
                  to="/blog"
                  search={{ page: n }}
                  aria-current={active ? "page" : undefined}
                  className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {n}
                </Link>
              );
            })}

            <Link
              to="/blog"
              search={{ page: Math.min(totalPages, current + 1) }}
              aria-label="Next page"
              aria-disabled={current === totalPages}
              className={`inline-flex h-10 items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground ${
                current === totalPages ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>
        )}
      </section>
    </SiteLayout>
  );
}
