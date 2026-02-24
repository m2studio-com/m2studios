"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Youtube, Mail, Phone, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass border-t border-border mt-12 md:mt-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-light.png"
                alt="M2 Studio Icon"
                width={50}
                height={50}
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <div className="text-xl md:text-2xl font-bold">
                <span className="text-glow-yellow" style={{ color: "#FACC15" }}>
                  M2
                </span>
                <span style={{ color: "#FFFFFF" }}> Studio</span>
              </div>
            </div>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
              Professional video editing and creative studio delivering exceptional content for creators worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-bold text-sm md:text-base mb-3 md:mb-4 pb-1 inline-block"
              style={{ color: "#FACC15", borderBottom: "2px solid #FFFFFF" }}
            >
              QUICK LINKS
            </h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link
                  href="/services"
                  className="footer-link hover:text-glow-yellow transition-colors text-xs md:text-sm"
                  style={{ color: "#9CA3AF" }}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="footer-link hover:text-glow-yellow transition-colors text-xs md:text-sm"
                  style={{ color: "#9CA3AF" }}
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="footer-link hover:text-glow-yellow transition-colors text-xs md:text-sm"
                  style={{ color: "#9CA3AF" }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="footer-link hover:text-glow-yellow transition-colors text-xs md:text-sm"
                  style={{ color: "#9CA3AF" }}
                >
                  Place Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3
              className="font-bold text-sm md:text-base mb-3 md:mb-4 pb-1 inline-block"
              style={{ color: "#FACC15", borderBottom: "2px solid #FFFFFF" }}
            >
              SERVICES
            </h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li className="text-xs md:text-sm" style={{ color: "#9CA3AF" }}>
                Wedding Film Editing
              </li>
              <li className="text-xs md:text-sm" style={{ color: "#9CA3AF" }}>
                Reels & Shorts
              </li>
              <li className="text-xs md:text-sm" style={{ color: "#9CA3AF" }}>
                YouTube Editing
              </li>
              <li className="text-xs md:text-sm" style={{ color: "#9CA3AF" }}>
                Thumbnail Design
              </li>
              <li className="text-xs md:text-sm" style={{ color: "#9CA3AF" }}>
                Logo & Animation
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-span-2 md:col-span-1">
            <h3
              className="font-bold text-sm md:text-base mb-3 md:mb-4 pb-1 inline-block"
              style={{ color: "#FACC15", borderBottom: "2px solid #FFFFFF" }}
            >
              CONTACT
            </h3>
            <div className="space-y-2 md:space-y-3 mb-4">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <Mail size={14} className="md:w-4 md:h-4" style={{ color: "#9CA3AF" }} />
                <a
                  href="mailto:support@m2studio.in"
                  className="footer-link hover:text-glow-yellow transition-colors"
                  style={{ color: "#9CA3AF" }}
                >
                  support@m2studio.in
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <Phone size={14} className="md:w-4 md:h-4" style={{ color: "#9CA3AF" }} />
                <a
                  href="tel:+918122426212"
                  className="footer-link hover:text-glow-yellow transition-colors"
                  style={{ color: "#9CA3AF" }}
                >
                  +91 81224 26212
                </a>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 items-center">
              <a
                href="https://www.instagram.com/_m2_studio?igsh=MWlncW5tb2w1ZnJ1ZA=="
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#0E0E0E] transition-all duration-300 hover:bg-[#FACC15] hover:-translate-y-0.5 group"
              >
                <Instagram
                  size={18}
                  className="md:w-5 md:h-5 text-[#FACC15] group-hover:text-black transition-colors"
                />
              </a>
              <a
                href="https://twitter.com/m2studio"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#0E0E0E] transition-all duration-300 hover:bg-[#FACC15] hover:-translate-y-0.5 group"
              >
                <Twitter size={18} className="md:w-5 md:h-5 text-[#FACC15] group-hover:text-black transition-colors" />
              </a>
              <a
                href="https://youtube.com/@m2studio22?si=mD3sh14mzcFhEO_b"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#0E0E0E] transition-all duration-300 hover:bg-[#FACC15] hover:-translate-y-0.5 group"
              >
                <Youtube size={18} className="md:w-5 md:h-5 text-[#FACC15] group-hover:text-black transition-colors" />
              </a>
              <a
                href="https://discord.gg/S6czasYYdE"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#0E0E0E] transition-all duration-300 hover:bg-[#FACC15] hover:-translate-y-0.5 group"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="md:w-5 md:h-5 fill-[#FACC15] group-hover:fill-black transition-colors"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t border-border mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm"
          style={{ color: "#9CA3AF" }}
        >
          <p>&copy; {currentYear} M2 Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
