import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { sanityClient, allPostsQuery, type SanityPost } from "@/lib/sanity";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List all published Ziyarath blog articles on Islamic history, Kerala heritage, sacred mosques and scholars. Returns title, slug, excerpt, tag, author and publish date.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Maximum number of posts to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const posts = await sanityClient.fetch<SanityPost[]>(allPostsQuery);
    const trimmed = posts.slice(0, limit ?? 20).map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      tag: p.tag,
      author: p.author,
      publishedAt: p.publishedAt,
      url: `https://ziyarath.com/blog/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(trimmed, null, 2) }],
      structuredContent: { posts: trimmed, total: posts.length },
    };
  },
});
