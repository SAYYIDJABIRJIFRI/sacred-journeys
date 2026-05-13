import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { POSTS, getPostBySlug, type BlogPost } from "@/data/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Article not found — Ziyarath" }] };
    }
    const title = `${post.title} — Ziyarath`;
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { name: "author", content: post.author },
        { property: "article:published_time", content: post.isoDate },
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:image", content: post.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.image },
      ],
      links: [
        { rel: "canonical", href: `https://ziyarath.com/blog/${post.slug}` },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl font-semibold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          The article you are looking for may have been moved or does not exist.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.isoDate,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Ziyarath",
    },
    mainEntityOfPage: `https://ziyarath.com/blog/${post.slug}`,
  };

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
            <span className="mt-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {post.tag}
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author}
              </span>
              <time
                dateTime={post.isoDate}
                className="inline-flex items-center gap-1.5"
              >
                <Calendar className="h-4 w-4" /> {post.date}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readingTime}
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <img
            src={post.image}
            alt={post.title}
            width={1200}
            height={675}
            className="-mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-elegant"
          />
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {post.content.map((block, i) =>
              typeof block === "string" ? (
                <p
                  key={i}
                  className="text-base leading-relaxed text-foreground/90 sm:text-lg"
                >
                  {block}
                </p>
              ) : (
                <h2
                  key={i}
                  className="mt-10 font-display text-2xl font-semibold sm:text-3xl"
                >
                  {block.h}
                </h2>
              ),
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Continue reading
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {p.tag}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-primary">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
