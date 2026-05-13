import { createFileRoute } from "@tanstack/react-router";
import { POSTS } from "@/data/posts";

const ROUTES = ["/", "/about", "/blog", "/contact", "/privacy"];
const BASE = "https://ziyarath.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const staticUrls = ROUTES.map(
          (r) =>
            `<url><loc>${BASE}${r}</loc><changefreq>weekly</changefreq><priority>${r === "/" ? "1.0" : "0.8"}</priority></url>`,
        ).join("");
        const postUrls = POSTS.map(
          (p) =>
            `<url><loc>${BASE}/blog/${p.slug}</loc><lastmod>${p.isoDate}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
        ).join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${postUrls}</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});
