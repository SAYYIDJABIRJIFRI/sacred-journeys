import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const SANITY_PROJECT_ID = "mb5anos4";
export const SANITY_DATASET = "production";

export const sanityClient: SanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}

export type SanityImage = {
  asset?: { _ref?: string; _id?: string };
  _type?: string;
};

export type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tag?: string;
  author?: string;
  publishedAt?: string;
  coverImage?: SanityImage;
  body?: unknown;
  seoTitle?: string;
  seoDescription?: string;
};

export const postFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  tag,
  author,
  publishedAt,
  coverImage,
  seoTitle,
  seoDescription
`;

export const allPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  ${postFields}
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  ${postFields},
  body
}`;

export function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function postImageUrl(post: { coverImage?: SanityImage }, w = 1200, h = 800): string | undefined {
  if (!post.coverImage?.asset) return undefined;
  try {
    return urlFor(post.coverImage).width(w).height(h).fit("crop").auto("format").url();
  } catch {
    return undefined;
  }
}
