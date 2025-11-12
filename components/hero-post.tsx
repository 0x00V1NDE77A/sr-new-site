import Link from "next/link"
import Image from "next/image"
import Date from "./date"
import CoverImage from "./cover-image"
import Avatar from "./avatar"
export interface PostMetaFragment {
  _id: string
  _slug: string
  _title: string
  href: string
  author?: {
    _title: string
    avatar: {
      url: string
      alt: string
    }
  }
  coverImage: {
    url: string
    alt: string
    aspectRatio: number
  }
  date: string
  excerpt: string
}

export function HeroPost({
  _title,
  coverImage,
  date,
  excerpt,
  author,
  _slug,
  href,
}: PostMetaFragment) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage
          title={_title}
          slug={_slug}
          href={href}
          url={coverImage.url}
          width={400}
          height={300}
          priority
        />
      </div>
      <div className="mb-20 md:mb-28">
        <h3 className="mb-4 text-4xl leading-tight lg:text-6xl">
          <Link href={href} className="hover:underline">
            {_title}
          </Link>
        </h3>
        
        <div className="mb-6 text-base text-muted-foreground">
          <Date dateString={date} />
        </div>
        
        <p className="mb-6 text-lg leading-relaxed">{excerpt}</p>
        
        {author && <Avatar title={author._title} url={author.avatar.url} />}
      </div>
    </section>
  )
}
