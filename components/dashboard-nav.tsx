"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogOut, User } from "lucide-react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface DashboardNavProps {
  userRole: "client" | "admin"
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useAuth()

  const handleNavClick = () => {
    setIsOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navLinks =
    userRole === "admin"
      ? [
          { href: "/", label: "Home" },
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/orders", label: "All Orders" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/free-files", label: "Free Files" },
          { href: "/order", label: "New Order" },
        ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: "1px solid rgba(250,204,21,0.2)" }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={handleNavClick}>
            <Image
              src="/logo-transparent.png"
              alt="M2 Studio"
              width={280}
              height={140}
              className="h-16 w-auto"
              priority
            />
            <span
              className="text-2xl font-bold uppercase"
              style={{ textShadow: "0 0 12px rgba(250, 204, 21, 0.35), 0 0 20px rgba(250, 204, 21, 0.2)" }}
            >
              <span style={{ color: "#FACC15" }}>M2</span> <span style={{ color: "#FFFFFF" }}>STUDIO</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={`nav-link text-sm xl:text-base font-medium transition-all duration-300 ${
                  pathname === link.href ? "text-[#FACC15]" : "text-white hover:text-[#FACC15]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard/profile">
              <button className="px-4 py-2 text-[#FACC15] font-medium border border-[#FACC15] rounded-full transition-all duration-300 hover:bg-[#FACC15] hover:text-black hover:shadow-[0_0_10px_rgba(250,204,21,0.3)] active:shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                <User size={18} className="inline mr-2" />
                Profile
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white font-medium border-2 border-white rounded-full transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] active:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              <LogOut size={18} className="inline mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4" style={{ borderTop: "1px solid rgba(250,204,21,0.2)" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link block text-lg font-medium transition-all duration-300 ${
                  pathname === link.href ? "text-[#FACC15]" : "text-white hover:text-[#FACC15]"
                }`}
                onClick={handleNavClick}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard/profile" onClick={handleNavClick}>
              <button className="w-full px-4 py-2 text-[#FACC15] font-medium border border-[#FACC15] rounded-full transition-all duration-300 hover:bg-[#FACC15] hover:text-black">
                <User size={18} className="inline mr-2" />
                Profile
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-white font-medium border-2 border-white rounded-full transition-all duration-300 hover:bg-white/10"
            >
              <LogOut size={18} className="inline mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
