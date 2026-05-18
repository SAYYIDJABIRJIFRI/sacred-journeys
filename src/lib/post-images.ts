import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import placeHaram from "@/assets/place-haram.jpg";
import placeNabawi from "@/assets/place-nabawi.jpg";
import placeMalik from "@/assets/place-malikdinar.jpg";
import kerala from "@/assets/kerala-heritage.jpg";

/**
 * Local fallback cover images, keyed by slug.
 * Used when a Sanity post does not have a `coverImage` asset yet.
 */
export const FALLBACK_IMAGES: Record<string, string> = {
  "history-of-malik-dinar-in-kerala": blog1,
  "islamic-heritage-in-india": blog2,
  "importance-of-ziyarath-in-islam": blog3,
  "masjid-al-haram-the-heart-of-islam": placeHaram,
  "al-masjid-an-nabawi-the-prophets-mosque": placeNabawi,
  "kerala-mosque-architecture-a-living-tradition": kerala,
  "the-dargah-of-mampuram-thangal": placeMalik,
  "etiquette-of-visiting-mosques-as-a-traveller": blog2,
};

export const DEFAULT_FALLBACK_IMAGE = blog1;

export function resolveCover(
  slug: string,
  sanityUrl?: string,
): string {
  return sanityUrl ?? FALLBACK_IMAGES[slug] ?? DEFAULT_FALLBACK_IMAGE;
}
