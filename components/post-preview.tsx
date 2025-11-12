import Link from "next/link"
import Avatar from "./avatar"
import Date from "./date"
import CoverImage from "./cover-image"
import { PostMetaFragment } from "./hero-post"

export function PostPreview({
  _title,
  coverImage,
  date,
  excerpt,
  author,
  _slug,
  href,
}: PostMetaFragment) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage
          title={_title}
          slug={_slug}
          href={href}
          url={coverImage.url}
          width={700}
          height={700}
          className="aspect-video"
        />
      </div>
      <h3 className="text-3xl mb-3 leading-snug text-white">
        <Link href={href} className="hover:underline text-white">
          {_title}
        </Link>
      </h3>
      <div className="text-base text-gray-300 mb-4">
        <Date dateString={date} />
      </div>
      <p className="text-lg leading-relaxed mb-4 text-white">{excerpt}</p>
      {author && <Avatar title={author._title} url={author.avatar.url} />}
    </div>
  )
}
