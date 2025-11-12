try {
  await import("dotenv/config");
} catch (error) {
  if (error?.code !== "ERR_MODULE_NOT_FOUND") {
    console.warn("Failed to load dotenv:", error);
  }
}
import { MongoClient } from "mongodb";

const DEFAULT_URI = "mongodb://127.0.0.1:27017/sr-holding";
const uri = process.env.MONGODB_URI || DEFAULT_URI;
const databaseName = process.env.MONGODB_DB || new URL(uri).pathname.replace("/", "") || "sr-holding";

function generateSlug(value) {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hasMeaningfulTranslation(translation = {}) {
  if (!translation) return false;
  return Boolean(
    (translation.title && translation.title.trim()) ||
      (translation.excerpt && translation.excerpt.trim()) ||
      (translation.heroImage && translation.heroImage.trim()) ||
      (Array.isArray(translation.content) &&
        translation.content.some(
          (block) => block && typeof block.content === "string" && block.content.trim().length > 0,
        )) ||
      (translation.seo &&
        ((translation.seo.metaTitle && translation.seo.metaTitle.trim()) ||
          (translation.seo.metaDescription && translation.seo.metaDescription.trim()) ||
          (Array.isArray(translation.seo.keywords) && translation.seo.keywords.length > 0)))
  );
}

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection("blogs");

    const cursor = collection.find({});
    let processed = 0;
    let updated = 0;

    while (await cursor.hasNext()) {
      const blog = await cursor.next();
      processed += 1;

      const translations = blog.translations ?? {};
      const bgTranslation = translations.bg;

      if (hasMeaningfulTranslation(bgTranslation)) {
        continue;
      }

      const fallbackSeo = blog.seo ?? {};
      const nextTranslation = {
        title: bgTranslation?.title ?? blog.title ?? "",
        slug: bgTranslation?.slug ?? generateSlug(blog.title ?? ""),
        excerpt: bgTranslation?.excerpt ?? blog.excerpt ?? "",
        heroImage: bgTranslation?.heroImage ?? blog.heroImage ?? "",
        content: Array.isArray(bgTranslation?.content) && bgTranslation.content.length
          ? bgTranslation.content
          : Array.isArray(blog.content)
            ? blog.content
            : [],
        seo: {
          metaTitle: bgTranslation?.seo?.metaTitle ?? fallbackSeo.metaTitle ?? "",
          metaDescription: bgTranslation?.seo?.metaDescription ?? fallbackSeo.metaDescription ?? "",
          keywords: Array.isArray(bgTranslation?.seo?.keywords)
            ? bgTranslation.seo.keywords
            : Array.isArray(fallbackSeo.keywords)
              ? fallbackSeo.keywords
              : [],
          socialTitle: bgTranslation?.seo?.socialTitle ?? fallbackSeo.socialTitle,
          socialDescription: bgTranslation?.seo?.socialDescription ?? fallbackSeo.socialDescription,
          socialImage: bgTranslation?.seo?.socialImage ?? fallbackSeo.socialImage,
        },
      };

      await collection.updateOne(
        { _id: blog._id },
        {
          $set: {
            "translations.bg": nextTranslation,
            updatedAt: new Date(),
          },
        },
      );

      updated += 1;
    }

    console.log(`Processed ${processed} blog(s). Updated ${updated} translation(s).`);
    if (updated > 0) {
      console.log("Bulgarian translations were initialised using the default English content.");
    } else {
      console.log("No blogs required migration.");
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

