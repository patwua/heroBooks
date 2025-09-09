import Image from "next/image"

export function FeatureCard(props: { title: string; body: string; img: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <h3 className="text-2xl font-semibold">{props.title}</h3>
        <p className="mt-2 text-muted-foreground">{props.body}</p>
      </div>
      <div className="order-1 md:order-2">
        <div className="w-full max-w-sm">
          <Image
            src={props.img}
            alt={props.title}
            width={800}
            height={800}
            className="rounded-2xl aspect-square object-cover hb-card"
            priority={false}
          />
        </div>
      </div>
    </div>
  )
}
