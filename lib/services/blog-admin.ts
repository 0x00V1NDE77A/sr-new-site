import clientPromise from "@/lib/mongodb"
import type { BlogPost } from "@/lib/models/blog"
import { isAppLocale, type AppLocale } from "@/lib/i18n/config"

export function generateSlug(value?: string) {
  if (!value) return ""
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function normalizeSeo(
  seo: any,
  fallbackTitle?: string,
  fallbackDescription?: string,
) {
  const rawKeywords = seo?.keywords
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords.map((keyword: any) => keyword?.toString?.().trim()).filter(Boolean)
    : typeof rawKeywords === "string"
      ? rawKeywords.split(",").map((keyword) => keyword.trim()).filter(Boolean)
      : []

  return {
    metaTitle:
      typeof seo?.metaTitle === "string" && seo.metaTitle.trim()
        ? seo.metaTitle
        : (fallbackTitle ?? ""),
    metaDescription:
      typeof seo?.metaDescription === "string" && seo.metaDescription.trim()
        ? seo.metaDescription
        : (fallbackDescription ?? ""),
    keywords,
    ...(seo?.socialTitle && typeof seo.socialTitle === "string"
      ? { socialTitle: seo.socialTitle }
      : {}),
    ...(seo?.socialDescription && typeof seo.socialDescription === "string"
      ? { socialDescription: seo.socialDescription }
      : {}),
    ...(seo?.socialImage && typeof seo.socialImage === "string"
      ? { socialImage: seo.socialImage }
      : {}),
  }
}

export function sanitizeTranslations(raw: any): NonNullable<BlogPost["translations"]> {
  const sanitized: NonNullable<BlogPost["translations"]> = {}
  if (!raw || typeof raw !== "object") return sanitized

  for (const [localeKey, value] of Object.entries(raw)) {
    if (!isAppLocale(localeKey)) continue
    if (!value || typeof value !== "object") continue

    const translationValue = value as Record<string, any>

    const locale = localeKey as AppLocale
    const title = typeof translationValue.title === "string" ? translationValue.title : ""
    const excerpt = typeof translationValue.excerpt === "string" ? translationValue.excerpt : ""
    const heroImage =
      typeof translationValue.heroImage === "string" ? translationValue.heroImage : undefined
    const content = Array.isArray(translationValue.content) ? translationValue.content : []
    const seoObject =
      translationValue.seo && typeof translationValue.seo === "object"
        ? (translationValue.seo as Record<string, any>)
        : undefined

    const seo =
      seoObject && (seoObject.metaTitle || seoObject.metaDescription || seoObject.keywords)
        ? {
            ...(typeof seoObject.metaTitle === "string" && seoObject.metaTitle.trim()
              ? { metaTitle: seoObject.metaTitle }
              : {}),
            ...(typeof seoObject.metaDescription === "string" && seoObject.metaDescription.trim()
              ? { metaDescription: seoObject.metaDescription }
              : {}),
            ...(Array.isArray(seoObject.keywords)
              ? {
                  keywords: seoObject.keywords
                    .map((keyword: any) => keyword?.toString?.().trim())
                    .filter(Boolean),
                }
              : {}),
            ...(typeof seoObject.socialTitle === "string" && seoObject.socialTitle.trim()
              ? { socialTitle: seoObject.socialTitle }
              : {}),
            ...(typeof seoObject.socialDescription === "string" && seoObject.socialDescription.trim()
              ? { socialDescription: seoObject.socialDescription }
              : {}),
            ...(typeof seoObject.socialImage === "string" && seoObject.socialImage.trim()
              ? { socialImage: seoObject.socialImage }
              : {}),
          }
        : undefined

    const hasMeaningfulData =
      (title && title.trim().length > 0) ||
      (excerpt && excerpt.trim().length > 0) ||
      (heroImage && heroImage.trim().length > 0) ||
      (Array.isArray(content) &&
        content.some(
          (block: any) =>
            block &&
            typeof block.content === "string" &&
            block.content.trim().length > 0,
        )) ||
      (seo &&
        ((seo.metaTitle && seo.metaTitle.trim().length > 0) ||
          (seo.metaDescription && seo.metaDescription.trim().length > 0) ||
          (seo.keywords && seo.keywords.length > 0)))

    if (!hasMeaningfulData) {
      continue
    }

    const translationEntry: NonNullable<BlogPost["translations"]>[AppLocale] = {}

    if (title) translationEntry.title = title
    if (typeof translationValue.slug === "string" && translationValue.slug.trim().length > 0) {
      translationEntry.slug = generateSlug(translationValue.slug)
    } else if (title) {
      translationEntry.slug = generateSlug(title)
    }
    if (excerpt) translationEntry.excerpt = excerpt
    if (heroImage) translationEntry.heroImage = heroImage
    if (Array.isArray(content) && content.length > 0) {
      translationEntry.content = content
    }
    if (seo && Object.keys(seo).length > 0) {
      translationEntry.seo = seo
    }

    sanitized[locale] = translationEntry
  }

  return sanitized
}

export async function updateCategoryCount(db: any, categoryName: string, increment: number) {
  await db.collection("categories").updateOne(
    { name: categoryName },
    {
      $inc: { postCount: increment },
      $setOnInsert: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )
}

export async function updateTagCounts(db: any, tags: string[], increment: number) {
  for (const tagName of tags) {
    await db.collection("tags").updateOne(
      { name: tagName },
      {
        $inc: { postCount: increment },
        $setOnInsert: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )
  }
}

export async function createBlogFromPayload(body: any) {
  const {
    translations: rawTranslations,
    slug: providedSlug,
    content: rawContent,
    seo: rawSeo,
    tags: rawTags,
    ...restBody
  } = body ?? {}

  const contentBlocks = Array.isArray(rawContent) ? rawContent : []
  const tags: string[] = Array.isArray(rawTags) ? rawTags : []
  const seo = normalizeSeo(rawSeo, restBody.title, restBody.excerpt)
  const translations = sanitizeTranslations(rawTranslations)

  console.log("📥 Blog API - Received blog data:", {
    title: restBody?.title,
    contentBlocks: contentBlocks.length,
    contentTypes: contentBlocks.map((b: any) => b.type) || [],
    hasContent: contentBlocks.length > 0,
    contentStructure:
      contentBlocks.map((b: any) => ({
        id: b.id,
        type: b.type,
        contentLength: b.content?.length || 0,
        hasMetadata: !!b.metadata,
        metadataKeys: Object.keys(b.metadata || {}),
      })) || [],
  })

  const client = await clientPromise
  const db = client.db()
  const blogsCollection = db.collection<BlogPost>("blogs")

  const slug = generateSlug(providedSlug || restBody.title)

  const existingBlog = await blogsCollection.findOne({ slug })
  if (existingBlog) {
    throw new Error("A blog with this title already exists")
  }

  const wordCount = contentBlocks
    .filter((block: any) => block.type === "paragraph")
    .reduce((count: number, block: any) => count + block.content.split(" ").length, 0)
  const readingTime = Math.ceil(wordCount / 200)

  const newBlog: Omit<BlogPost, "_id"> = {
    ...restBody,
    slug,
    content: contentBlocks,
    seo,
    tags,
    translations: Object.keys(translations).length > 0 ? translations : undefined,
    readingTime,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: restBody.status === "published" ? new Date() : undefined,
  }

  console.log("📝 Blog API - Creating blog with:", {
    slug,
    readingTime,
    contentBlocks: newBlog.content?.length ?? 0,
    contentTypes: newBlog.content.map((b) => b.type),
  })

  const result = await blogsCollection.insertOne(newBlog)

  if (restBody.category) {
    await updateCategoryCount(db, restBody.category, 1)
  }
  if (tags.length > 0) {
    await updateTagCounts(db, tags, 1)
  }

  console.log("✅ Blog API - Blog created successfully with ID:", result.insertedId)

  return {
    insertedId: result.insertedId,
    slug,
    readingTime,
  }
}

