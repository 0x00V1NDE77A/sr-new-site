import Image from "next/image"

export function BodyImage({
  ...props
}: {
  src: string
  alt?: string | undefined
  width?: number | undefined
  height?: number | undefined
  caption?: string | undefined
}) {
  return (
    <figure>
      <Image
        {...props}
        alt={props.caption ?? "Image"}
        className="rounded-lg"
        width={700}
        height={700}
      />
      {props.caption && (
        <figcaption className="text-center">{props.caption}</figcaption>
      )}
    </figure>
  )
}
