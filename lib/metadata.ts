import type { Metadata } from "next";

const OG_IMAGE = "/images/logo.svg";

/**
 * Builds a per-page Metadata object with matching OG/Twitter tags and the
 * shared logo thumbnail. Children layouts fully override the root openGraph/
 * twitter objects, so we re-supply the image every time.
 */
export function buildMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
