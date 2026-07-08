import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { sanityClient, postBySlugQuery, type SanityPost } from "@/lib/sanity";

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description:
    "Fetch the full content of a single Ziyarath blog article by its slug, including the article body (portable text).",
  inputSchema: {
    slug: z.string().min(1).describe("The blog post slug, e.g. 'kerala-islamic-heritage'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const post = await sanityClient.fetch<SanityPost | null>(postBySlugQuery, { slug });
    if (!post) {
      return {
        content: [{ type: "text", text: `No blog post found with slug "${slug}".` }],
        isError: true,
      };
    }
    const payload = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      tag: post.tag,
      author: post.author,
      publishedAt: post.publishedAt,
      body: post.body,
      url: `https://ziyarath.com/blog/${post.slug}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { post: payload },
    };
  },
});
