import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  sanityClient,
  allPostsQuery,
  postBySlugQuery,
  formatDate,
  postImageUrl,
  urlFor,
  type SanityPost,
} from "@/lib/sanity";
import { resolveCover } from "@/lib/post-images";

type PostWithBody = SanityPost & { body?: unknown };

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params }) => {
    const [post, all] = await Promise.all([
      sanityClient.fetch<PostWithBody | null>(postBySlugQuery, { slug: params.slug }),
      sanityClient.fetch<SanityPost[]>(allPostsQuery),
    ]);
    if (!post) throw notFound();
    const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);
    return { post, related };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Article not found — Ziyarath" }] };
    }
    const SITE = "https://ziyarath-heritage-explore.lovable.app";
    const url = `${SITE}/blog/${params.slug}`;
    const title = post.seoTitle || `${post.title} — Ziyarath`;
    const description = post.seoDescription || post.excerpt || "";
    const image = resolveCover(post.slug, postImageUrl(post, 1200, 675));
    const blogPostingLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || description,
      image: [image],
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: {
        "@type": post.author ? "Person" : "Organization",
        name: post.author ?? "Ziyarath",
      },
      publisher: {
        "@type": "Organization",
        name: "Ziyarath",
        logo: {
          "@type": "ImageObject",
          url: `${SITE}/favicon.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      url,
      ...(post.tag ? { keywords: post.tag, articleSection: post.tag } : {}),
      inLanguage: "en",
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(post.author ? [{ name: "author", content: post.author }] : []),
        ...(post.publishedAt
          ? [{ property: "article:published_time", content: post.publishedAt }]
          : []),
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(blogPostingLd),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
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

const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-display text-2xl font-semibold sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-xl font-semibold sm:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      try {
        const url = urlFor(value).width(1200).fit("max").auto("format").url();
        return (
          <img
            src={url}
            alt={value?.alt ?? ""}
            className="my-8 w-full rounded-2xl shadow-card"
            loading="lazy"
          />
        );
      } catch {
        return null;
      }
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-6 list-disc space-y-2 text-foreground/90">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="ml-6 list-decimal space-y-2 text-foreground/90">{children}</ol>
    ),
  },
};

function PostPage() {
  const { post, related } = Route.useLoaderData() as {
    post: PostWithBody;
    related: SanityPost[];
  };
  const coverImage = resolveCover(post.slug, postImageUrl(post, 1600, 900));
  const dateLabel = formatDate(post.publishedAt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: coverImage,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author ?? "Ziyarath" },
    publisher: { "@type": "Organization", name: "Ziyarath" },
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
            {post.tag && (
              <span className="mt-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {post.tag}
              </span>
            )}
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {post.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {post.author}
                </span>
              )}
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt}
                  className="inline-flex items-center gap-1.5"
                >
                  <Calendar className="h-4 w-4" /> {dateLabel}
                </time>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <img
            src={coverImage}
            alt={post.title}
            width={1200}
            height={675}
            className="-mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-elegant"
          />
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {post.body ? (
              <PortableText
                value={post.body as Parameters<typeof PortableText>[0]["value"]}
                components={portableComponents}
              />
            ) : (
              <p className="text-muted-foreground">No content yet.</p>
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
              {related.map((p) => {
                const img = resolveCover(p.slug, postImageUrl(p, 800, 500));
                return (
                  <Link
                    key={p.slug}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    search={{}}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={img}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      {p.tag && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {p.tag}
                        </span>
                      )}
                      <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-primary">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
