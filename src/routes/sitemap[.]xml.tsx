import { createFileRoute } from "@tanstack/react-router";
import { sanityClient } from "@/lib/sanity";

const ROUTES = ["/", "/about", "/blog", "/contact", "/privacy"];
const BASE = "https://ziyarath.com";

type SitemapPost = { slug: string; publishedAt?: string; _updatedAt?: string };

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let posts: SitemapPost[] = [];
        try {
          posts = await sanityClient.fetch<SitemapPost[]>(
            `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
              "slug": slug.current, publishedAt, _updatedAt
            }`,
          );
        } catch {
          posts = [];
        }

        const staticUrls = ROUTES.map(
          (r) =>
            `<url><loc>${BASE}${r}</loc><changefreq>weekly</changefreq><priority>${r === "/" ? "1.0" : "0.8"}</priority></url>`,
        ).join("");
        const postUrls = posts
          .map((p) => {
            const lastmod = (p.publishedAt ?? p._updatedAt ?? "").slice(0, 10);
            return `<url><loc>${BASE}/blog/${p.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>monthly</changefreq><priority>0.7</priority></url>`;
          })
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${postUrls}</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});
