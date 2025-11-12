import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import type { BlogPost } from "@/lib/models/blog"
import { ObjectId } from "mongodb"
import { isAppLocale, type AppLocale } from "@/lib/i18n/config"

function generateSlug(value?: string) {
  if (!value) return ""
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function normalizeSeo(
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

function sanitizeTranslations(raw: any): NonNullable<BlogPost["translations"]> {
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

// GET - Fetch single blog
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("[v0] GET blog error:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

// PUT - Update blog
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    const {
      translations: rawTranslations,
      slug: providedSlug,
      content: rawContent,
      seo: rawSeo,
      tags: rawTags,
      status: providedStatus,
      ...restBody
    } = body ?? {}

    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    // Get existing blog for comparison
    const existingBlog = await blogsCollection.findOne({ _id: new ObjectId(id) })
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const contentBlocks = Array.isArray(rawContent) ? rawContent : existingBlog.content
    const tags: string[] = Array.isArray(rawTags) ? rawTags : existingBlog.tags
    const translations = sanitizeTranslations(rawTranslations)
    const baseTitle = typeof restBody.title === "string" ? restBody.title : existingBlog.title
    const baseExcerpt =
      typeof restBody.excerpt === "string" ? restBody.excerpt : existingBlog.excerpt

    // Update slug if provided or title changed
    const slug =
      typeof providedSlug === "string" && providedSlug.trim()
        ? generateSlug(providedSlug)
        : baseTitle === existingBlog.title
          ? existingBlog.slug
          : generateSlug(baseTitle)

    // Calculate reading time
    const wordCount = contentBlocks
      .filter((block: any) => block.type === "paragraph")
      .reduce((count: number, block: any) => count + block.content.split(" ").length, 0)
    const readingTime = Math.ceil(wordCount / 200)

    const seo = normalizeSeo(
      rawSeo ?? existingBlog.seo,
      baseTitle,
      baseExcerpt,
    )

    const nextStatus: BlogPost["status"] =
      providedStatus && ["draft", "published", "archived"].includes(providedStatus)
        ? providedStatus
        : existingBlog.status

    let publishedAt = existingBlog.publishedAt
    if (nextStatus === "published" && existingBlog.status !== "published") {
      publishedAt = new Date()
    } else if (nextStatus !== "published" && existingBlog.status === "published") {
      publishedAt = existingBlog.publishedAt ?? undefined
    }

    const updateData = {
      ...restBody,
      slug,
      content: contentBlocks,
      seo,
      tags,
      status: nextStatus,
      readingTime,
      updatedAt: new Date(),
      publishedAt,
    }

    if (Object.keys(translations).length > 0) {
      updateData.translations = {
        ...(existingBlog.translations ?? {}),
        ...translations,
      }
    }

    await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    // Update category counts if changed
    if (restBody.category && restBody.category !== existingBlog.category) {
      await updateCategoryCount(db, existingBlog.category, -1)
      await updateCategoryCount(db, restBody.category, 1)
    }

    // Update tag counts if changed
    const oldTags = existingBlog.tags || []
    const newTags = tags || []
    const removedTags = oldTags.filter((tag: string) => !newTags.includes(tag))
    const addedTags = newTags.filter((tag: string) => !oldTags.includes(tag))

    if (removedTags.length > 0) await updateTagCounts(db, removedTags, -1)
    if (addedTags.length > 0) await updateTagCounts(db, addedTags, 1)

    return NextResponse.json({ message: "Blog updated successfully" })
  } catch (error) {
    console.error("[v0] PUT blog error:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

// DELETE - Delete blog
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    await blogsCollection.deleteOne({ _id: new ObjectId(id) })

    // Update category and tag counts
    await updateCategoryCount(db, blog.category, -1)
    await updateTagCounts(db, blog.tags, -1)

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("[v0] DELETE blog error:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}

// Helper functions (same as in main route)
async function updateCategoryCount(db: any, categoryName: string, increment: number) {
  await db.collection("categories").updateOne({ name: categoryName }, { $inc: { postCount: increment } })
}

async function updateTagCounts(db: any, tags: string[], increment: number) {
  for (const tagName of tags) {
    await db.collection("tags").updateOne({ name: tagName }, { $inc: { postCount: increment } })
  }
}
