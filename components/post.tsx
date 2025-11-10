import CoverImage from "@/components/cover-image"
import Avatar from "@/components/avatar"
import Date from "@/components/date"
import { BodyImage } from "./body-image"
import { convertContentBlocksToHTML } from "@/lib/utils"

export interface PostFragment {
  _title: string
  _slug: string
  _id: string
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
  body: {
    json: {
      content: string | any[] // Can be HTML string or content blocks array
    }
  }
}

export function Post({ _title, author, date, coverImage, body }: PostFragment) {
  // Convert content blocks to HTML if needed
  const content = typeof body.json.content === 'string' 
    ? body.json.content 
    : convertContentBlocksToHTML(body.json.content)

  return (
    <article>
      <h1 className="mb-12 text-center text-5xl font-bold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-7xl text-white">
        {_title}
      </h1>

      <div className="hidden md:block md:mb-6">
        {author && <Avatar title={author._title} url={author.avatar.url} />}
      </div>
      <div className="hidden md:block md:mb-12 text-base text-gray-300">
        <Date dateString={date} />
      </div>

      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImage
          title={_title}
          url={coverImage.url}
          width={1500}
          height={1000}
          priority
        />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 block md:hidden">
          {author && <Avatar title={author._title} url={author.avatar.url} />}
        </div>
        <div className="mb-12 text-base text-gray-300 block md:hidden">
          <Date dateString={date} />
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="prose dark:prose-invert hover:prose-a:text-orange-500 max-w-none text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-li:text-white prose-blockquote:text-white [&_p]:!text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_li]:!text-white [&_blockquote]:!text-white [&_strong]:!text-white [&_em]:!text-white">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </article>
  )
}
