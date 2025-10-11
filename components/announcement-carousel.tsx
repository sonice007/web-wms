"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface Announcement {
  id: string
  title: string
  description: string
  imageUrl: string
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Pendaftaran Anggota Baru Dibuka",
    description: "Daftarkan diri Anda dan dapatkan benefit eksklusif sebagai anggota",
    imageUrl: "/announcement-registration.jpg",
  },
  {
    id: "2",
    title: "Rapat Koordinasi Bulanan",
    description: "Hadir dalam rapat koordinasi untuk membahas program kerja bulan ini",
    imageUrl: "/meeting-coordination.jpg",
  },
  {
    id: "3",
    title: "Program Pelatihan Gratis",
    description: "Ikuti pelatihan skill development untuk meningkatkan kompetensi Anda",
    imageUrl: "/training-program.png",
  },
]

export function AnnouncementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const autoSlideRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1))
    }, 10000)

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
      }
    }
  }, [])

  const resetAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current)
    }
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1))
    }, 10000)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1))
      resetAutoSlide()
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1))
      resetAutoSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {announcements.map((announcement) => (
            <div key={announcement.id} className="min-w-full">
              <Card className="relative h-48 overflow-hidden border-0 shadow-lg">
                <img
                  src={announcement.imageUrl || "/placeholder.svg"}
                  alt={announcement.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-lg font-bold mb-1 text-balance">{announcement.title}</h3>
                  <p className="text-sm opacity-90 text-pretty">{announcement.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {announcements.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
            onClick={() => {
              setCurrentIndex(index)
              resetAutoSlide()
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
