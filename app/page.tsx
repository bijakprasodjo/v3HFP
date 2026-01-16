"use client";

import InquiryForm from "@/components/InquiryForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import { track } from "@/lib/analytics";
import type React from "react";
import Link from "next/link";


import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";


function YearbookModal({
  isOpen,
  onClose,
  images,
  title,
  type = "image",
  modalSize = "default",
  initialIndex = 0,
}: {
  isOpen: boolean
  onClose: () => void
  images: string[]
  title: string
  type?: "image" | "video"
  modalSize?: "default" | "wide" | "tall"
  initialIndex?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [images.length, isOpen, initialIndex])

  if (!isOpen) return null

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length).
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const openFullVideo = () => {
    if (type === "video") {
      const videoSrc = images[currentIndex]
      const newWindow = window.open("", "_blank")
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Video - ${title}</title></head>
            <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;">
              <video controls autoplay style="max-width:100%;max-height:100%;">
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </body>
          </html>
        `)
      }
    }
  }

  const getModalClasses = () => {
    switch (modalSize) {
      case "wide":
        return "max-w-2xl max-h-[70vh]" 
      case "tall":
        return "max-w-lg max-h-[90vh]" 
      default:
        return "max-w-md max-h-[80vh]" 
    }
  }

  const getImageClasses = () => {
    switch (modalSize) {
      case "wide":
        return "h-64"
      case "tall":
        return "h-96" 
      default:
        return "h-80" 
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`relative ${getModalClasses()} w-full`}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 shadow-2xl border-4 border-amber-200">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-4 shadow-inner border-2 border-amber-300">
           
            <div className="relative">
              <div
                className={`relative ${getImageClasses()} rounded-xl overflow-hidden bg-white shadow-lg border-4 border-gray-200`}
              >
                {type === "video" ? (
                  <div className="relative w-full h-full group cursor-pointer" onClick={openFullVideo}>
                    <video
                      ref={videoRef}
                      src={images[currentIndex] || "/placeholder.mp4"}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                      playsInline
                      poster="/placeholder.svg?height=320&width=400&text=Video+Thumbnail"
                    />
                    {/* Play button overlay */}
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-0 h-0 border-l-[8px] border-l-gray-800 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                      </div>
                    </div> */}
                  </div>
                ) : (
                  <img
                    src={images[currentIndex] || "/placeholder.svg"}
                    alt={`${title} ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  />
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-800/80 hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-800/80 hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}

                {/* Dots Navigation */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex ? "bg-white shadow-lg scale-125" : "bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom caption */}
            <div className="mt-6 text-center">
              <div className="bg-gradient-to-r from-amber-200 to-orange-200 rounded-full px-6 py-2 inline-block border-2 border-amber-400 shadow-md">
                <span className="text-amber-800 font-black text-sm">Happy Friends Project</span>
              </div>
            </div>

            {/* Picture index below image */}
            {images.length > 1 && (
              <div className="mt-2 text-amber-800 text-sm font-semibold w-full flex justify-center">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Video Modal Component - Full screen video popup
function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  videoTitle,
}: {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
  videoTitle: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video src={videoSrc} className="w-full h-full object-contain" controls autoPlay playsInline />
        </div>
      </div>
    </div>
  )
}

// Service Carousel Component with Auto-advance, Click to Modal, and Navigation Arrows
function ServiceCarousel({
  images,
  title,
  onImageClick,
  type = "image",
}: {
  images: string[]
  title: string
  onImageClick?: (index: number) => void
  type?: "image" | "video"
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="relative group">
      {/* Main Image/Video Display */}
      <div className="relative h-40 rounded-xl overflow-hidden">
        {type === "video" ? (
          <video
            src={images[currentIndex] || "/placeholder.mp4"}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out cursor-pointer hover:scale-105"
            muted
            autoPlay
            loop
            playsInline
            poster="/placeholder.svg?height=200&width=300&text=Video+Thumbnail"
            onClick={() => onImageClick && onImageClick(currentIndex)}
          />
        ) : (
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${title} ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out cursor-pointer hover:scale-105"
            onClick={() => onImageClick && onImageClick(currentIndex)}
          />
        )}

        {/* Navigation Arrows - Only visible on hover */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10"
        >
          <ChevronLeft className="w-4 h-4 text-gray-800" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10"
        >
          <ChevronRight className="w-4 h-4 text-gray-800" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-3 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white shadow-lg scale-110" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Portfolio Carousel Component for the new layout with Navigation Arrows
function PortfolioCarousel({
  images,
  title,
  height = "h-32",
  autoAdvanceDelay = 4000,
  onImageClick,
}: {
  images: string[]
  title: string
  height?: string
  autoAdvanceDelay?: number
  onImageClick?: (index: number) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoAdvanceDelay)
    return () => clearInterval(interval)
  }, [images.length, autoAdvanceDelay])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="relative group">
      {/* Main Image Display */}
      <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-lg">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${title} ${currentIndex + 1}`}
          className={`w-full ${height} object-cover transition-all duration-1000 ease-in-out cursor-pointer hover:scale-105`}
          onClick={() => onImageClick && onImageClick(currentIndex)}
        />

        {/* Navigation Arrows - Only visible on hover */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10"
        >
          <ChevronLeft className="w-3 h-3 text-gray-800" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10"
        >
          <ChevronRight className="w-3 h-3 text-gray-800" />
        </button>

        {/* Overlay with dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white shadow-lg scale-110" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Video Carousel Component for video content with modal support
function VideoCarousel({ videos, title }: { videos: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [modalVideoSrc, setModalVideoSrc] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-play video when currentIndex changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [currentIndex])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
  }

  const openVideoModal = (videoSrc: string) => {
    setModalVideoSrc(videoSrc)
    setVideoModalOpen(true)
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = e.currentTarget.querySelector("video") as HTMLVideoElement
    if (video) {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        video.play()
        setIsPlaying(true)
      }
    }
  }

  // Handler for when video ends
  const handleVideoEnded = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
    setIsPlaying(false)
  }

  return (
    <>
      <div className="relative">
        {/* Main Video Display */}
        <div className="relative h-40 rounded-xl overflow-hidden group">
          <video
            ref={videoRef}
            src={videos[currentIndex] || "/placeholder.mp4"}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out cursor-pointer hover:scale-105"
            muted
            loop={false}
            playsInline
            poster="/placeholder.svg?height=200&width=300&text=Video+Thumbnail"
            onClick={() => openVideoModal(videos[currentIndex])}
            onEnded={handleVideoEnded}
          />

          {/* Play/Pause Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              {isPlaying ? (
                <div className="w-3 h-3 bg-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-gray-800"></div>
                    <div className="w-1 h-3 bg-gray-800"></div>
                  </div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
              )}
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-3 space-x-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white shadow-lg scale-110" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoSrc={modalVideoSrc}
        videoTitle={title}
      />
    </>
  )
}

// TikTok Icon Component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Modal states for yearbook-style popups
  const [yearbookModalOpen, setYearbookModalOpen] = useState(false)
  const [photographyModalOpen, setPhotographyModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [fullVideoModalOpen, setFullVideoModalOpen] = useState(false)
  const [modalVideoSrc, setModalVideoSrc] = useState("")

  // Portfolio modal states
  const [portfolioLeftTopModalOpen, setPortfolioLeftTopModalOpen] = useState(false)
  const [portfolioLeftBottomModalOpen, setPortfolioLeftBottomModalOpen] = useState(false)
  const [portfolioCenterModalOpen, setPortfolioCenterModalOpen] = useState(false)
  const [portfolioRightTopModalOpen, setPortfolioRightTopModalOpen] = useState(false)
  const [portfolioRightBottomModalOpen, setPortfolioRightBottomModalOpen] = useState(false)

  // Add state for modal indices
  const [yearbookModalIndex, setYearbookModalIndex] = useState(0)
  const [photographyModalIndex, setPhotographyModalIndex] = useState(0)
  const [portfolioLeftTopModalIndex, setPortfolioLeftTopModalIndex] = useState(0)
  const [portfolioLeftBottomModalIndex, setPortfolioLeftBottomModalIndex] = useState(0)
  const [portfolioCenterModalIndex, setPortfolioCenterModalIndex] = useState(0)
  const [portfolioRightTopModalIndex, setPortfolioRightTopModalIndex] = useState(0)
  const [portfolioRightBottomModalIndex, setPortfolioRightBottomModalIndex] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      // Detect active section based on scroll position
      const sections = ["home", "services", "portfolio", "client","testimonials", "about", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

   // ✅ Feature #5: log page view once when page loads
  useEffect(() => {
    void track("view_page", { page: "home" });
  }, []);

  const scrollToSection = (sectionId: string, meta: Record<string, unknown> = {}) => {
    // Track only events that exist in DB enum
    if (sectionId === "portfolio") {
      void track("click_view_portfolio", { from: "navigation", ...meta });
    }

    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });

    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const openWhatsApp = () => {
    void track("click_whatsapp", { from: activeSection ?? "unknown" });

    const phoneNumber = "628111224478";
    const message = "Mau nanya-nanya min soal Happy Friends Project";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };


  // Real yearbook images
  const yearbookImages = [
    "/yearbook1.jpg", // Wanderlust theme
    "/yearbook2.jpg", // Luxerra theme
    "/yearbook3.jpg", // Actala theme
    "/yearbook4.jpg", // The Musical theme
    "/yearbook5.jpg", // Antevorta theme
  ]

  // Real photography images - Updated with actual images
  const photographyImages = [
    "/photography1.jpg", // Student profiles with orange background
    "/photography2.jpg", // Class of 2023 Group 8
    "/photography3.jpg", // Money Heist themed
    "/photography4.jpg", // Our Profile with golden frames
    "/photography5.jpg", // Money Heist graduation theme
  ]

  const videoImages = [
    "/v1.mp4", 
    "/v2.mp4", 
    "/placeholder.mp4"]

  // Portfolio images for different sections
  const portfolioLeftTopImages = ["/kia1.JPG", "/kia2.JPG", "/kia3.JPG"]

  const portfolioLeftBottomImages = ["/kib1.JPG", "/kib2.JPG", "/kib3.JPG"]

  const portfolioRightBottomImages = ["/kb1.JPG", "/kb2.JPG", "/kb3.JPG"]
  const portfolioRightTopImages = ["/ka1.JPG", "/ka2.JPG", "/ka3.JPG"]

  // Updated center portfolio images with the 4 real photos provided by user
  const portfolioCenterImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nara%20Olivia%20Lahutna.JPG-bMW6GO9wjJYhTAJzufxiO0I0XT61uo.jpeg", // Nara Olivia Lahutna - vintage aesthetic portrait
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rana%20Hazimah.JPG-YUVuiQ8ffnsxH5bE6azcenLlSgp6f2.jpeg", // Rana Hazimah - professional portrait with hijab
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fabio%20Alfath%20Setiawan.JPG-BjjQB4wc5ztGG4dHPOzypwXkJ5LquM.jpeg", // Fabio Alfath Setiawan - modern futuristic portrait
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Djimi%20Rizqi%20Darmawan.JPG-V7KRZK8GMBl0ksIPOUiuu0wfQ8es4I.jpeg", // Djimi Rizqi Darmawan - creative shopping cart portrait
  ]

  const stats = [
    { number: "8", label: "Years", subtitle: "& still going strong" },
    { number: "85+", label: "Schools", subtitle: "across Indonesia" },
    { number: "150+", label: "Yearbooks", subtitle: "created with love" },
    { number: "12", label: "Cities", subtitle: "we've reached" },
    { number: "1K+", label: "Designs", subtitle: "unique & creative" },
    { number: "15K+", label: "Photos", subtitle: "captured memories" },
  ]

  const faqs = [
    {
      question: "Dimana Kantor Pusat Happy Friends Project?",
      answer:
        "Kantor pusat kami berada di Bandar Lampung dan kami melayani seluruh Indonesia dengan tim kreatif yang berpengalaman dalam pembuatan yearbook.",
    },
    {
      question: "Apakah Memiliki Legalitas?",
      answer:
        "Ya, Happy Friends Project adalah perusahaan yang terdaftar resmi dengan semua dokumen legalitas yang lengkap.",
    },
    {
      question: "Apakah Ada Garansi?",
      answer: "Kami memberikan garansi kepuasan 100% untuk setiap project yearbook yang kami kerjakan.",
    },
    {
      question: "Apakah Happy Friends Project Bisa Menerima Project di Luar Jawa?",
      answer:
        "Tentu saja! Kami melayani seluruh Indonesia dan siap membantu sekolah di manapun untuk membuat yearbook yang memorable.",
    },
    {
      question: "Bagaimana Sistem Pembayaran Projectnya?",
      answer:
        "Kami menyediakan sistem pembayaran yang fleksibel dengan berbagai metode pembayaran yang aman dan terpercaya.",
    },
  ]

  const videoFiles = [
    "/videos/v1.mp4",
    // "/videos/video2.mp4",
  ]

  const clientLogos = [
    "/client_1metro.png?height=80&width=80&text=Client+1",
    "/client_alazharbogor.png?height=80&width=80&text=Client+2",
    "/client_yakobus.png?height=80&width=80&text=Client+3",
    "/client_cendekia.png?height=80&width=80&text=Client+4",
    "/client_darma.png?height=80&width=80&text=Client+5",
    "/client_global.png?height=80&width=80&text=Client+6",
    "/client_globalprestasi.png?height=80&width=80&text=Client+7",
    "/client_iclampung.png?height=80&width=80&text=Client+8",
    "/client_icm.png?height=80&width=80&text=Client+9",
    "/client_kebangsaan.png?height=80&width=80&text=Client+10",
    "/client_madani.png?height=80&width=80&text=Client+11",
    "/client_man1.png?height=80&width=80&text=Client+12",
    "/client_pelitabangsa.png?height=80&width=80&text=Client+13",
    "/client_penabur.png?height=80&width=80&text=Client+14",
    "/client_santo.png?height=80&width=80&text=Client+15",
    "/client_sanur.png?height=80&width=80&text=Client+16",
    "/client_tunasmekar.png?height=80&width=80&text=Client+17",
    "/client_yp.png?height=80&width=80&text=Client+18",
    "/client_theresia.png?height=80&width=80&text=Client+19",
    "/client_avicenna.png?height=80&width=80&text=Client+20",
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #FF1493, #FF69B4)`,
            opacity: 0.1,
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #00BFFF, #1E90FF)`,
            opacity: 0.08,
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #FFD700, #FFA500)`,
            opacity: 0.1,
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #8A2BE2, #9370DB)`,
            opacity: 0.08,
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
        {/* HP Logo Silhouette Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-96 h-96 opacity-5 transform rotate-12"
            style={{
              backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hp-removebg-preview-mWbCO2m0mEnyTiYjULaSWk7YyKUTKs.png')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              transform: `rotate(12deg) translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
            }}
          />
        </div>
      </div>

      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center justify-between transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50" : "bg-transparent"
          }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hp-removebg-preview-mWbCO2m0mEnyTiYjULaSWk7YyKUTKs.png"
              alt="Happy Friends Project Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HAPPY FRIENDS PROJECT
            </h1>
            <p className="text-xs text-gray-600">#BEHAPPYWITHYOURFRIENDS</p>
          </div>
        </div>

        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => scrollToSection("home")}
            className={`transition-colors font-bold ${activeSection === "home" ? "text-purple-600" : "text-gray-800 hover:text-purple-600"
              }`}
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className={`transition-colors font-bold ${activeSection === "services" ? "text-purple-600" : "text-gray-800 hover:text-purple-600"
              }`}
          >
            SERVICES
          </button>
          <button
            onClick={() => scrollToSection("portfolio")}
            className={`transition-colors font-bold ${activeSection === "portfolio" ? "text-purple-600" : "text-gray-800 hover:text-purple-600"
              }`}
          >
            PORTFOLIO
          </button>
          <button
            onClick={() => scrollToSection("client")}
            className={`transition-colors font-bold ${activeSection === "client" ? "text-purple-600" : "text-gray-800 hover:text-purple-600"
              }`}
          >
            CLIENT
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className={`transition-colors font-bold ${activeSection === "testimonials" ? "text-purple-600" : "text-gray-800 hover:text-purple-600"
              }`}
          >
            TESTIMONIALS
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className={`transition-colors font-bold ${activeSection === "about" ? "text-purple-600" : "text-gray-800 hover:text-purple-600"
              }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className={`transition-colors font-bold ${activeSection === "contact" ? "text-purple-600" : "text-gray-800 hover:text-purple-600"
              }`}
          >
            CONTACT
          </button>
          <Link
            href="/quotes"
            className="transition-colors font-bold text-gray-800 hover:text-purple-600"
          >
            QUOTES
          </Link>

        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-800 hover:text-purple-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <button
              onClick={() => scrollToSection("home")}
              className={`text-2xl transition-colors font-bold ${activeSection === "home" ? "text-purple-400" : "text-white hover:text-yellow-300"
                }`}
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className={`text-2xl transition-colors font-bold ${activeSection === "services" ? "text-purple-400" : "text-white hover:text-yellow-300"
                }`}
            >
              SERVICES
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className={`text-2xl transition-colors font-bold ${activeSection === "portfolio" ? "text-purple-400" : "text-white hover:text-yellow-300"
                }`}
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => scrollToSection("client")}
              className={`text-2xl transition-colors font-bold ${activeSection === "client" ? "text-purple-400" : "text-white hover:text-yellow-300"
                }`}
            >
              CLIENT
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`text-2xl transition-colors font-bold ${activeSection === "about" ? "text-purple-400" : "text-white hover:text-yellow-300"
                }`}
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`text-2xl transition-colors font-bold ${activeSection === "contact" ? "text-purple-400" : "text-white hover:text-yellow-300"
                }`}
            >
              CONTACT
            </button>
            <Link
              href="/quotes"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl transition-colors font-bold text-white hover:text-yellow-300"
            >
              QUOTES
            </Link>
            <button
              onClick={() => scrollToSection("testimonials")}
             className={`text-2xl transition-colors font-bold ${activeSection === "testimonials" ? "text-purple-400" : "text-white hover:text-yellow-300"
                }`}
            >
              TESTIMONIALS
            </button>


          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative z-10 px-4 py-20 lg:py-28 pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl">
                Your Ideas,
              </span>
              <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
                Our Passion,
              </span>
              <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl" >
                Built With Love.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              We create unforgettable yearbooks that capture your precious moments with friends. Let's make your school
              memories last forever!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 text-lg font-black shadow-2xl border-2 border-gray-900 transform hover:scale-105 transition-all rounded-xl"
              >
                Start Your Project
              </Button>
              <Button
                size="lg"
                onClick={() => scrollToSection("portfolio")}
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 text-lg font-black shadow-2xl border-2 border-gray-900 transform hover:scale-105 transition-all rounded-xl"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Updated to match reference exactly */}
      <section id="services" className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-gray-700 font-medium">All the best choice come from us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Yearbook Design Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 border-4 border-black shadow-2xl">
              <h3 className="text-4xl font-black text-white mb-2">Fully Custom Packaging</h3>
              <p className="text-white text-lg mb-8 font-bold">For Your Lasting Memories</p>

              {/* Image container with white border */}
              <div className="bg-white/10 rounded-2xl p-4 mb-8 border-4 border-white">
                <ServiceCarousel
                  images={yearbookImages}
                  title="Yearbook Design"
                  onImageClick={(idx) => {
                    setYearbookModalIndex(idx)
                    setYearbookModalOpen(true)
                  }}
                />
              </div>
            </div>

            {/* Photography Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 border-4 border-black shadow-2xl">
              <h3 className="text-4xl font-black text-yellow-300 mb-2">Exclusive Yearbook Design</h3>
              <p className="text-white text-lg mb-8 font-bold">Memories crafted with love</p>

              {/* Image container */}
              <div className="bg-white/10 rounded-2xl p-4 mb-8 border-4 border-white">
                <ServiceCarousel
                  images={photographyImages}
                  title="Photography"
                  onImageClick={(idx) => {
                    setPhotographyModalIndex(idx)
                    setPhotographyModalOpen(true)
                  }}
                />
              </div>
            </div>

            {/* Video Production Card */}
            <div className="bg-gradient-to-br from-gray-800 to-black rounded-3xl p-8 border-4 border-black shadow-2xl">
              <h3 className="text-4xl font-black text-red-400 mb-2">Timeless Cinematic Video</h3>
              <p className="text-white text-lg mb-8 font-bold">Stories that come alive on screen</p>

              {/* Video container with ServiceCarousel */}
              <div className="bg-white/10 rounded-2xl p-4 mb-8 border-4 border-white">
                <ServiceCarousel
                  images={videoFiles}
                  title="Video Production"
                  type="video"
                  onImageClick={(idx) => {
                    setVideoModalOpen(true)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section - Updated to match the second image layout */}
      <section id="portfolio" className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-[3rem] p-4 border-4 border-gray-900 shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-[2.5rem] p-8 border-2 border-white">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-6xl font-black text-orange-600 mb-4 drop-shadow-lg">Photo</h2>
                <p className="text-orange-700 text-xl font-bold">A gallery of unforgettable moments</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Left Column - 2 photos stacked - make slightly taller */}
                <div className="space-y-4 flex flex-col justify-center">
                  <PortfolioCarousel
                    images={portfolioLeftTopImages}
                    title="Portfolio Left Top"
                    height="h-40"
                    autoAdvanceDelay={5000}
                    onImageClick={(idx) => {
                      setPortfolioLeftTopModalIndex(idx)
                      setPortfolioLeftTopModalOpen(true)
                    }}
                  />
                  <PortfolioCarousel
                    images={portfolioLeftBottomImages}
                    title="Portfolio Left Bottom"
                    height="h-40"
                    autoAdvanceDelay={5500}
                    onImageClick={(idx) => {
                      setPortfolioLeftBottomModalIndex(idx)
                      setPortfolioLeftBottomModalOpen(true)
                    }}
                  />
                </div>

                {/* Center Column - 1 large featured photo - make much taller */}
                <div className="flex items-center justify-center">
                  <div className="w-full">
                    <PortfolioCarousel
                      images={portfolioCenterImages}
                      title="Portfolio Center Featured"
                      height="h-96"
                      autoAdvanceDelay={6000}
                      onImageClick={(idx) => {
                        setPortfolioCenterModalIndex(idx)
                        setPortfolioCenterModalOpen(true)
                      }}
                    />
                  </div>
                </div>

                {/* Right Column - 2 photos stacked - make slightly taller */}
                <div className="space-y-4 flex flex-col justify-center">
                  <PortfolioCarousel
                    images={portfolioRightTopImages}
                    title="Portfolio Right Top"
                    height="h-40"
                    autoAdvanceDelay={5200}
                    onImageClick={(idx) => {
                      setPortfolioRightTopModalIndex(idx)
                      setPortfolioRightTopModalOpen(true)
                    }}
                  />
                  <PortfolioCarousel
                    images={portfolioRightBottomImages}
                    title="Portfolio Right Bottom"
                    height="h-40"
                    autoAdvanceDelay={4800}
                    onImageClick={(idx) => {
                      setPortfolioRightBottomModalIndex(idx)
                      setPortfolioRightBottomModalOpen(true)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Client Section - Fixed seamless infinite looping */}
      <section id="client" className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              OUR CLIENT
            </h2>
            <p className="text-xl text-gray-700 font-medium">Partners who trust us</p>
          </div>

          {/* Animated Client Logos Grid - Fixed for seamless infinite looping */}
          <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-3xl p-8 border-4 border-purple-200 shadow-2xl">
            <div className="relative">
              {/* First Row - Moving Right to Left - Seamless loop */}
              <div className="client-scroll-container mb-6">
                <div className="flex animate-scroll-right">
                  {/* Create exactly 2 identical sets for perfect seamless loop */}
                  {Array.from({ length: 2 }, (_, setIndex) =>
                    clientLogos.slice(0, 10).map((logo, index) => (
                      <div
                        key={`row1-set${setIndex}-${index}`}
                        className="flex-shrink-0 w-20 h-20 mx-4 bg-white rounded-full shadow-lg border-2 border-purple-200 flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                      >
                        <img
                          src={logo || "/placeholder.svg"}
                          alt={`Client ${index + 1}`}
                          className="w-12 h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Second Row - Moving Left to Right - Seamless loop */}
              <div className="client-scroll-container">
                <div className="flex animate-scroll-left">
                  {/* Create exactly 2 identical sets for perfect seamless loop */}
                  {Array.from({ length: 2 }, (_, setIndex) =>
                    clientLogos.slice(10, 20).map((logo, index) => (
                      <div
                        key={`row2-set${setIndex}-${index}`}
                        className="flex-shrink-0 w-20 h-20 mx-4 bg-white rounded-full shadow-lg border-2 border-pink-200 flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                      >
                        <img
                          src={logo || "/placeholder.svg"}
                          alt={`Client ${index + 11}`}
                          className="w-12 h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-purple-400 rounded-full opacity-20"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-pink-400 rounded-full opacity-30"></div>
            <div className="absolute bottom-4 left-1/3 w-4 h-4 bg-orange-400 rounded-full opacity-25"></div>
            <div className="absolute bottom-8 right-1/4 w-10 h-10 bg-purple-300 rounded-full opacity-15"></div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      
      {/* About/Stats Section */}
      <section id="about" className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              HAPPY FRIENDS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-pink-500 to-purple-600 border-2 border-pink-300/50 shadow-xl rounded-3xl transform hover:scale-105 transition-all"
              >
                <CardContent className="p-6 text-center rounded-3xl">
                  <div className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">{stat.number}</div>
                  <div className="text-xl md:text-2xl font-black text-yellow-300 mb-1 drop-shadow-lg">{stat.label}</div>
                  <div className="text-sm text-white font-bold">{stat.subtitle}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-4 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent">
            Any Questions?
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b-4 border-purple-500">
                <button
                  className="w-full py-6 flex justify-between items-center text-left hover:text-purple-600 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-xl md:text-2xl font-black text-gray-800">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-6 h-6 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="pb-6 text-gray-700 text-lg leading-relaxed font-medium">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section className="relative z-10 px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Address
              </h2>

              <div className="space-y-12">
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-black text-purple-600 mb-6">Lampung Office</h3>
                  <p className="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed font-medium">
                    Jl. H. Agus Salim No. 122, Bandar Lampung
                    <br />
                    Lampung 35114
                  </p>
                  
                  <h3 className="text-2xl md:text-3xl font-black mb-8 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                    Representative Marketing
                  </h3>

                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Jambi</h4>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Padang</h4>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Palembang</h4>
                    </div>
                    <div>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Jakarta</h4>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Tangerang</h4>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Bandung</h4>
                    </div>
                    <div>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Malang</h4>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Pasuruan</h4>
                      <h4 className="font-black mb-2 text-purple-600 text-lg">Samarinda</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

      {/* Contact Section - Updated to match the design exactly */}
        <section id="contact" className="relative z-10 px-4 py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Contact Our Admin
              </h2>
              <p className="text-xl text-gray-600 font-medium">Ready to help you from our office</p>
            </div>

            {/* Main Contact Card */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
                Udah siap buat yearbook impianmu?
              </h3>
              <p className="text-xl md:text-2xl text-white font-bold mb-8 drop-shadow-lg">Segera hubungi tim kami!</p>

              <Button
                onClick={openWhatsApp}
                className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-4 text-lg md:text-xl font-black shadow-xl rounded-full transform hover:scale-105 transition-all border-2 border-white"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.085" />
                </svg>
                Hubungi kami
              </Button>
              <div className="mt-10 mx-auto max-w-2xl">
  <div className="rounded-3xl bg-white/95 p-6 md:p-8 shadow-2xl">
    <h4 className="text-2xl font-black text-gray-900 mb-2">Atau isi form inquiry</h4>
    <p className="text-gray-600 font-medium mb-6">
      Biar tim kami bisa follow up lebih cepat & terdata.
    </p>
    <InquiryForm />
  </div>
</div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-4 py-12 bg-white border-t-4 border-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hp-removebg-preview-mWbCO2m0mEnyTiYjULaSWk7YyKUTKs.png"
                    alt="Happy Friends Project Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  HAPPY FRIENDS PROJECT
                </h1>
              </div>
              <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                #BEHAPPYWITHYOURFRIENDS
              </p>

              {/* Social Media Links with Icons */}
              <div className="flex justify-center space-x-8 mb-8">
                <a
                  href="https://www.instagram.com/happyfriendsprjct/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@happyfriendsprjct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <TikTokIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://www.youtube.com/@happyfriendsproject4082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center border-t border-gray-200 pt-8">
              <p className="text-gray-500 font-medium mb-2">© 2025 Happy Friends Project. All rights reserved.</p>
              <p className="text-gray-400 text-sm font-medium">Created By B²AN</p>
            </div>
          </div>
        </footer>

        {/* All Yearbook-Style Modals with adaptive sizing */}
        <YearbookModal
          isOpen={yearbookModalOpen}
          onClose={() => setYearbookModalOpen(false)}
          images={yearbookImages}
          title="Yearbook Design"
          type="image"
          modalSize="wide"
          initialIndex={yearbookModalIndex}
        />

        <YearbookModal
          isOpen={photographyModalOpen}
          onClose={() => setPhotographyModalOpen(false)}
          images={photographyImages}
          title="Photography"
          type="image"
          modalSize="wide"
          initialIndex={photographyModalIndex}
        />

        <YearbookModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          images={videoFiles}
          title="Video Production"
          type="video"
          modalSize="wide"
          initialIndex={0}
        />

        {/* Portfolio Modals with adaptive sizing */}
        <YearbookModal
          isOpen={portfolioLeftTopModalOpen}
          onClose={() => setPortfolioLeftTopModalOpen(false)}
          images={portfolioLeftTopImages}
          title="Portfolio Collection"
          type="image"
          modalSize="wide"
          initialIndex={portfolioLeftTopModalIndex}
        />

        <YearbookModal
          isOpen={portfolioLeftBottomModalOpen}
          onClose={() => setPortfolioLeftBottomModalOpen(false)}
          images={portfolioLeftBottomImages}
          title="Portfolio Collection"
          type="image"
          modalSize="wide"
          initialIndex={portfolioLeftBottomModalIndex}
        />

        <YearbookModal
          isOpen={portfolioCenterModalOpen}
          onClose={() => setPortfolioCenterModalOpen(false)}
          images={portfolioCenterImages}
          title="Featured Portfolio"
          type="image"
          modalSize="tall"
          initialIndex={portfolioCenterModalIndex}
        />

        <YearbookModal
          isOpen={portfolioRightTopModalOpen}
          onClose={() => setPortfolioRightTopModalOpen(false)}
          images={portfolioRightTopImages}
          title="Portfolio Collection"
          type="image"
          modalSize="wide"
          initialIndex={portfolioRightTopModalIndex}
        />

        <YearbookModal
          isOpen={portfolioRightBottomModalOpen}
          onClose={() => setPortfolioRightBottomModalOpen(false)}
          images={portfolioRightBottomImages}
          title="Portfolio Collection"
          type="image"
          modalSize="wide"
          initialIndex={portfolioRightBottomModalIndex}
        />

        {/* Full Video Modal */}
        <VideoModal
          isOpen={fullVideoModalOpen}
          onClose={() => setFullVideoModalOpen(false)}
          videoSrc={modalVideoSrc}
          videoTitle="Video Production"
        />
      </div>
    )
    type ApprovedTestimonial = {
      id: string;
      created_at: string;
      name: string;
      organization: string | null;
      rating: number;
      message: string;
    };
  }
