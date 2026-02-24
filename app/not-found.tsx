import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050505" }}>
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 py-20">
          {/* 404 Number with Glow Effect */}
          <div className="relative mb-8">
            <h1
              className="text-[150px] md:text-[200px] font-black leading-none"
              style={{
                color: "#FACC15",
                textShadow: "0 0 40px rgba(250, 204, 21, 0.3), 0 0 80px rgba(250, 204, 21, 0.1)",
              }}
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-32 h-32 border-4 border-yellow-400/20 rounded-full animate-ping"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Oops! Page Not Found</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#FACC15", color: "#000" }}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-yellow-400/50 text-white transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400/10"
            >
              <Search className="w-5 h-5" />
              Browse Services
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className="text-gray-500 mb-4">Or check out these popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Portfolio", href: "/portfolio" },
                { name: "About Us", href: "/about" },
                { name: "Order Now", href: "/order" },
                { name: "Join Team", href: "/join" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
