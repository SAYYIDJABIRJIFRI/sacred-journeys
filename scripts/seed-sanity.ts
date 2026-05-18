import { createClient } from "@sanity/client";
import { POSTS } from "../src/data/posts.ts";

const client = createClient({
  projectId: "mb5anos4",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

function key() {
  return Math.random().toString(36).slice(2, 12);
}

function toPortableText(content: Array<string | { h: string }>) {
  return content.map((item) => {
    if (typeof item === "object" && "h" in item) {
      return {
        _type: "block",
        _key: key(),
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: key(), text: item.h, marks: [] }],
      };
    }
    return {
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text: item as string, marks: [] }],
    };
  });
}

async function main() {
  for (const p of POSTS) {
    const doc = {
      _id: `post-${p.slug}`,
      _type: "post",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      excerpt: p.excerpt,
      tag: p.tag,
      author: p.author,
      publishedAt: new Date(p.isoDate).toISOString(),
      body: toPortableText(p.content),
      seoTitle: p.title,
      seoDescription: p.excerpt,
    };
    await client.createOrReplace(doc);
    console.log("seeded", p.slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
