import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowRight, Calendar } from "lucide-react";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Ziyarath | Islamic Heritage Articles" },
      {
        name: "description",
        content:
          "Articles on Islamic history, Kerala heritage, sacred mosques, scholars and the etiquette of ziyarath.",
      },
      { property: "og:title", content: "Ziyarath Blog" },
      { property: "og:description", content: "Stories and history from Islamic heritage across the world." },
    ],
  }),
  component: BlogPage,
});

const POSTS = [
  {
    title: "History of Malik Dinar in Kerala",
    excerpt:
      "Tracing the journey of Islam's earliest envoy to the Malabar Coast and the mosques he is believed to have founded.",
    image: blog1,
    date: "May 2026",
    tag: "History",
  },
  {
    title: "Islamic Heritage in India",
    excerpt:
      "From the Deccan Sultanates to coastal mosques — exploring a thousand-year legacy etched into stone and memory.",
    image: blog2,
    date: "Apr 2026",
    tag: "Heritage",
  },
  {
    title: "Importance of Ziyarath in Islam",
    excerpt:
      "Understanding the meaning, etiquette and spiritual significance of visiting sacred places in the Islamic tradition.",
    image: blog3,
    date: "Apr 2026",
    tag: "Spirituality",
  },
];

function BlogPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Journal</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Stories of Faith, History & Heritage
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Carefully researched articles on Islamic history, sacred places and the
            living traditions of the ummah.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <article
              key={post.title}
              style={{ animationDelay: `${i * 120}ms` }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant animate-fade-up"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  width={800}
                  height={576}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                    {post.tag}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold leading-snug">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
