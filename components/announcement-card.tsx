import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface AnnouncementCardProps {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  date: string
  category: string
  variant?: "large" | "card" | "compact"
}

export function AnnouncementCard({
  id,
  title,
  excerpt,
  imageUrl,
  date,
  category,
  variant = "card",
}: AnnouncementCardProps) {
  if (variant === "large") {
    return (
      <Link href={`/pengumuman/${id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
          <div className="relative h-48">
            <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <Badge className="mb-2 bg-white/20 backdrop-blur-sm text-white border-0">{category}</Badge>
              <h3 className="text-lg font-bold mb-1 text-balance">{title}</h3>
              <div className="flex items-center gap-1.5 text-xs opacity-90">
                <Calendar className="w-3.5 h-3.5" />
                <span>{date}</span>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-pretty">{excerpt}</p>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link href={`/pengumuman/${id}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Badge variant="secondary" className="mb-1.5 text-xs">
                  {category}
                </Badge>
                <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2 text-balance">{title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{date}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Default card variant
  return (
    <Link className="block" href={`/pengumuman/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-40">
          <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground border-0">{category}</Badge>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-base leading-tight line-clamp-2 text-balance">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{excerpt}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
