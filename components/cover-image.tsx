import Link from "next/link"
import { clsx } from "clsx"
import Image from "next/image"

export default function CoverImage({
  title,
  url,
  slug,
  href,
  width,
  height,
  priority,
  className,
}: {
  title: string
  url: string
  slug?: string
  href?: string
  width: number
  height: number
  priority?: boolean
  className?: string
}) {
  const linkTarget = href ?? (slug ? `/post/${slug}` : undefined)
  const image = (
    <Image
      alt={`Cover Image for ${title}`}
      width={width}
      height={height}
      priority={priority}
      className={clsx("w-full h-auto shadow-sm rounded-lg object-cover", className, {
        "hover:shadow-md transition-shadow duration-200": !!linkTarget,
      })}
      src={url}
    />
  )

  return (
    <div className="sm:mx-0">
      {linkTarget ? (
        <Link href={linkTarget} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
