"use client"

import React from "react"

import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Eye, Heart, Users, Award, Clock, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
}: { end: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * end))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export default function AboutPage() {
  const founders = [
    {
      name: "Abishek U",
      role: "Founder & Lead Editor",
      image: "/founder-mama.jpg",
      bio: "With 8+ years of experience in video editing and post-production, Abishek founded M2 Studio to help creators worldwide achieve their creative vision.",
    },
  ]

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We deliver nothing but the best. Every project gets our full attention and expertise.",
    },
    {
      icon: Clock,
      title: "Speed",
      description: "Fast turnaround without compromising quality. We understand deadlines matter.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We love what we do. Our passion for storytelling shows in every frame.",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Your content is safe with us. Confidentiality and security are our priorities.",
    },
  ]

  const stats = [
    { number: 8, suffix: "+", label: "Years Experience" },
    { number: 500, suffix: "+", label: "Projects Completed" },
    { number: 200, suffix: "+", label: "Happy Clients" },
    { number: 50, suffix: "+", label: "Awards Won" },
  ]

  return (
    <>
      <AnimatedBackground />

      <main className="min-h-screen pt-24 pb-20">
        {/* Header */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 glass rounded-full border border-primary/30">
              <span style={{ color: "#FACC15" }} className="text-primary text-sm font-semibold">
                About M2 Studio
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              <span style={{ color: "#FFFFFF" }}>Crafting Stories,</span>
              <br />
              <span style={{ color: "#FACC15" }} className="text-glow-yellow">
                One Frame at a Time
              </span>
            </h1>

            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
              We're a passionate team of creative professionals dedicated to transforming your raw footage into stunning
              visual masterpieces
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="glass border-border p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ color: "#D1D5DB" }}>
                <p>
                  M2 Studio was born from a simple vision: to make professional video editing accessible to creators
                  everywhere. What started as two friends editing videos in a small apartment has grown into a
                  full-service creative studio serving clients worldwide.
                </p>
                <p>
                  We've had the privilege of working on hundreds of projects - from intimate wedding films to viral
                  social media content, from gaming montages to corporate presentations. Each project teaches us
                  something new and pushes us to raise our standards even higher.
                </p>
                <p>
                  Today, <span style={{ color: "#FACC15" }}>M2 Studio</span> is more than just an editing service. We're
                  a partner in your creative journey, committed to helping you tell your story in the most compelling
                  way possible.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="glass border-border p-8">
                <Target className="w-12 h-12 mb-4" style={{ color: "#FACC15" }} />
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
                  Our Mission
                </h3>
                <p className="leading-relaxed" style={{ color: "#D1D5DB" }}>
                  To empower creators worldwide with professional editing services that elevate their content and help
                  them achieve their goals. We believe great storytelling should be accessible to everyone.
                </p>
              </Card>

              <Card className="glass border-border p-8">
                <Eye className="w-12 h-12 mb-4" style={{ color: "#F59E0B" }} />
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
                  Our Vision
                </h3>
                <p className="leading-relaxed" style={{ color: "#D1D5DB" }}>
                  To become the world's most trusted creative partner for content creators, known for exceptional
                  quality, lightning-fast delivery, and unwavering commitment to our clients' success.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats - Updated to use AnimatedCounter */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="glass border-border p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: "#FACC15" }}>
                    <AnimatedCounter end={stat.number} duration={2000 + index * 200} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm" style={{ color: "#9CA3AF" }}>
                    {stat.label}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
                Meet Our Team
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
                The creative minds behind M2 Studio
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto justify-items-center">
              {founders.map((founder, index) => (
                <Card key={index} className="glass border-border overflow-hidden group max-w-sm w-full">
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                    <Image
                      src={founder.image || "/placeholder.svg"}
                      alt={founder.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 2}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1" style={{ color: "#FFFFFF" }}>
                      {founder.name}
                    </h3>
                    <p className="mb-4" style={{ color: "#FACC15" }}>
                      {founder.role}
                    </p>
                    <p className="leading-relaxed" style={{ color: "#D1D5DB" }}>
                      {founder.bio}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
                Our Values
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="glass border-border p-6 text-center hover:border-primary transition-all duration-300"
                >
                  {React.createElement(value.icon, {
                    className: "w-12 h-12 mx-auto mb-4",
                    style: { color: "#FACC15" },
                  })}
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFFFFF" }}>
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <Card className="glass border-primary/30 p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
              <div className="relative z-10">
                <Users className="w-16 h-16 mx-auto mb-6" style={{ color: "#FACC15" }} />
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
                  Join Our Creative Community
                </h2>
                <p className="mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
                  Be part of a growing community of creators who trust M2 Studio for their editing needs. Let's create
                  something amazing together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/order">
                    <Button
                      size="lg"
                      className="glow-yellow btn-lift"
                      style={{ background: "#FACC15", color: "#000000" }}
                    >
                      Start Your Project
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button
                      size="lg"
                      variant="outline"
                      className="btn-lift-outline bg-transparent"
                      style={{ borderColor: "#FFFFFF", color: "#FFFFFF", background: "transparent" }}
                    >
                      View Our Work
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
