"use client"

import type React from "react"
import { useState } from "react"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Star, Users, Zap, Globe, ArrowRight, Sparkles } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Flexible Hours",
    description: "Work on your own schedule. Part-time, full-time, or freelance options available.",
  },
  {
    icon: Globe,
    title: "Remote Work",
    description: "Work from anywhere in the world. All you need is a computer and internet.",
  },
  {
    icon: Users,
    title: "Great Team",
    description: "Join a community of talented creators and learn from the best in the industry.",
  },
  {
    icon: Star,
    title: "Competitive Pay",
    description: "Earn competitive rates for your work with timely payments every month.",
  },
]

const teamTestimonials = [
  {
    name: "Rahul Sharma",
    role: "Video Editor",
    duration: "2 years with M2",
    quote: "Joining M2 Studio was the best decision for my career. The flexibility and creative freedom is amazing!",
    avatar: "/indian-male-editor-portrait.jpg",
  },
  {
    name: "Priya Patel",
    role: "Thumbnail Designer",
    duration: "1.5 years with M2",
    quote: "I've grown so much as a designer here. The team is supportive and projects are always interesting.",
    avatar: "/indian-female-designer-portrait.jpg",
  },
  {
    name: "Amit Kumar",
    role: "Motion Graphics",
    duration: "3 years with M2",
    quote: "The variety of projects keeps me excited every day. Plus, working remotely is a huge bonus!",
    avatar: "/indian-male-motion-graphics-artist-portrait.jpg",
  },
]

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    portfolio: "",
    software: "",
    position: "",
    experience: "",
    device: "", // Added device field
    message: "",
    linkedinProfile: "",
    skills: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePositionClick = (positionTitle: string) => {
    setFormData((prev) => ({ ...prev, position: positionTitle }))
    // Scroll to application form
    const formSection = document.getElementById("application-form")
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Map form fields to the API's expected names
          ...formData,
          whyJoin: formData.message,
          durability: formData.experience,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          window.location.href = "/thank-you"
        }, 2000)
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          linkedinProfile: "",
          skills: "",
          experience: "",
          software: "",
          device: "",
          portfolio: "",
          message: "",
          position: "",
        })
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.error || "Failed to submit application.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            animation: "moveGrid 20s linear infinite",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <style jsx>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-40px, -40px); }
        }
      `}</style>

      {/* Application Form */}
      <section id="application-form" className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">We're Hiring!</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join the <span className="text-yellow-400">M2 Studio</span> Team
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Be part of a creative community that's shaping the future of video content.
            </p>
          </div>

          <div
            className="rounded-3xl shadow-2xl backdrop-blur-md p-6 md:p-10"
            style={{
              backgroundColor: "rgba(10, 10, 10, 0.9)",
              border: "1px solid #FACC15",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-white">
              Apply <span className="text-yellow-400">Now</span>
            </h2>
            <p className="text-center text-gray-400 text-sm mb-8">
              Fill out the form below and we'll get back to you within 48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-white">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-white">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium mb-2 text-white">
                    Portfolio Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    required
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="software" className="block text-sm font-medium mb-2 text-white">
                  Software & Tools You Use <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="software"
                  name="software"
                  required
                  value={formData.software}
                  onChange={handleChange}
                  placeholder="e.g., Premiere Pro, After Effects, DaVinci Resolve, Photoshop"
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-2 text-white">
                    Position Applying For <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    <option value="" className="bg-gray-900">
                      Select Position
                    </option>
                    <option value="Video Editor" className="bg-gray-900">
                      Video Editor
                    </option>
                    <option value="Thumbnail Designer" className="bg-gray-900">
                      Thumbnail Designer
                    </option>
                    <option value="Motion Graphics Artist" className="bg-gray-900">
                      Motion Graphics Artist
                    </option>
                    <option value="Color Grading Specialist" className="bg-gray-900">
                      Color Grading Specialist
                    </option>
                    <option value="Wedding Film Editor" className="bg-gray-900">
                      Wedding Film Editor
                    </option>
                    <option value="Social Media Editor" className="bg-gray-900">
                      Social Media Editor
                    </option>
                    <option value="Other" className="bg-gray-900">
                      Other
                    </option>
                  </select>
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-2 text-white">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    <option value="" className="bg-gray-900">
                      Select Experience
                    </option>
                    <option value="0-1 years" className="bg-gray-900">
                      0-1 years
                    </option>
                    <option value="1-3 years" className="bg-gray-900">
                      1-3 years
                    </option>
                    <option value="3-5 years" className="bg-gray-900">
                      3-5 years
                    </option>
                    <option value="5+ years" className="bg-gray-900">
                      5+ years
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="device" className="block text-sm font-medium mb-2 text-white">
                    Primary Device <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="device"
                    name="device"
                    required
                    value={formData.device}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    <option value="" className="bg-gray-900">
                      Select Device
                    </option>
                    <option value="Desktop/PC" className="bg-gray-900">
                      Desktop/PC
                    </option>
                    <option value="Laptop" className="bg-gray-900">
                      Laptop
                    </option>
                    <option value="MacBook" className="bg-gray-900">
                      MacBook
                    </option>
                    <option value="Tablet" className="bg-gray-900">
                      Tablet
                    </option>
                    <option value="Multiple Devices" className="bg-gray-900">
                      Multiple Devices
                    </option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                    Why do you want to join M2 Studio?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and why you'd be a great fit..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.device}
                className="w-full py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : submitStatus === "success" ? (
                  "Application Submitted!"
                ) : submitStatus === "error" ? (
                  "Failed to Submit"
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
              {submitStatus === "error" && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Open <span className="text-yellow-400">Positions</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            We're always looking for talented individuals. Check out our current openings below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              {
                title: "Video Editor",
                type: "Full Time / Part Time",
                skills: ["Premiere Pro", "After Effects", "DaVinci"],
              },
              { title: "Thumbnail Designer", type: "Freelance", skills: ["Photoshop", "Illustrator", "Canva"] },
              {
                title: "Motion Graphics Artist",
                type: "Full Time",
                skills: ["After Effects", "Cinema 4D", "Blender"],
              },
              { title: "Color Grading Specialist", type: "Part Time", skills: ["DaVinci Resolve", "Lightroom"] },
              { title: "Wedding Film Editor", type: "Freelance", skills: ["Premiere Pro", "Final Cut Pro"] },
              { title: "Social Media Editor", type: "Part Time", skills: ["CapCut", "Premiere Pro", "Reels"] },
            ].map((position, index) => (
              <button
                key={index}
                onClick={() => handlePositionClick(position.title)}
                className="flex items-center justify-between p-5 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-yellow-400/50 transition-all duration-300 group cursor-pointer text-left w-full"
              >
                <div>
                  <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                    {position.title}
                  </h4>
                  <p className="text-sm text-gray-500">{position.type}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {position.skills.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Join <span className="text-yellow-400">Us?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-yellow-400/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Testimonials */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Hear From Our <span className="text-yellow-400">Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamTestimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400/30"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-yellow-400 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-xs">{testimonial.duration}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </>
  )
}
