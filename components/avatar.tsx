import Image from "next/image";

export default function Avatar({ title, url }: { title: string; url: string }) {
  return (
    <div className="flex items-center">
      <div className="mr-4 w-12 h-12">
        <Image
          alt="SR Holding Logo"
          className="object-contain h-full w-full"
          height={96}
          width={96}
          src="/logo.png"
        />
      </div>
      <div className="text-xl font-bold">{title}</div>
    </div>
  );
}
