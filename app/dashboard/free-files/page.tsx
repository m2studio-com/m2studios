"use client"
import { Input } from "@/components/ui/input"
import ProtectedRoute from "@/components/protected-route"
import { DashboardNav } from "@/components/dashboard-nav"
import {
  Search,
  Download,
  BookOpen,
  HelpCircle,
  X,
  Monitor,
  Apple,
  Puzzle,
  Film,
  Palette,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Lock,
  Key,
  Copy,
  Check,
  Menu,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const freeFilesData = {
  softwares: {
    "Windows Softwares": [
      {
        title: "Adobe After Effects",
        icon: "🎬",
        color: "#9999FF",
        versions: [
          { name: "AE 2025 (v25.31.003)", link: "#", isNew: true },
          { name: "AE 2024", link: "#" },
          { name: "AE 2023", link: "#" },
          { name: "AE 2022", link: "#" },
          { name: "AE 2021", link: "#" },
          { name: "AE 2020", link: "#" },
        ],
      },
      {
        title: "Adobe Premiere Pro",
        icon: "🎥",
        color: "#9999FF",
        versions: [
          { name: "Pr 2025", link: "#", isNew: true },
          { name: "Pr 2024", link: "#" },
          { name: "Pr 2023", link: "#" },
          { name: "Pr 2022", link: "#" },
          { name: "Pr 2021", link: "#" },
          { name: "Pr 2020", link: "#" },
        ],
      },
      {
        title: "Adobe Photoshop",
        icon: "🖼️",
        color: "#31A8FF",
        versions: [
          { name: "Ps 2025 (v26.8.1.8)", link: "#", isNew: true },
          { name: "Ps 2024", link: "#" },
          { name: "Ps 2023", link: "#" },
          { name: "Ps 2022", link: "#" },
        ],
      },
      {
        title: "Adobe Illustrator",
        icon: "✏️",
        color: "#FF9A00",
        versions: [
          { name: "Ai 2025", link: "#", isNew: true },
          { name: "Ai 2024", link: "#" },
          { name: "Ai 2023", link: "#" },
          { name: "Ai 2022", link: "#" },
        ],
      },
      {
        title: "Adobe Media Encoder",
        icon: "📦",
        color: "#9999FF",
        versions: [
          { name: "ME 2025", link: "#", isNew: true },
          { name: "ME 2024", link: "#" },
          { name: "ME 2023", link: "#" },
        ],
      },
    ],
    "Mac Softwares": [
      {
        title: "Final Cut Pro",
        icon: "🎞️",
        color: "#FFFFFF",
        versions: [
          { name: "Final Cut Pro 11", link: "#", isNew: true },
          { name: "Final Cut Pro 10.8", link: "#" },
          { name: "Final Cut Pro 10.7", link: "#" },
        ],
      },
      {
        title: "DaVinci Resolve",
        icon: "🎨",
        color: "#FF4444",
        versions: [
          { name: "Resolve 19", link: "#", isNew: true },
          { name: "Resolve 18.6", link: "#" },
          { name: "Resolve 18.5", link: "#" },
        ],
      },
      {
        title: "Motion",
        icon: "💫",
        color: "#7B68EE",
        versions: [
          { name: "Motion 5.8", link: "#" },
          { name: "Motion 5.7", link: "#" },
        ],
      },
    ],
  },
  plugins: {
    "After Effects Plugins": [
      {
        title: "Red Giant Plugins",
        icon: "🔴",
        color: "#FF4444",
        versions: [
          { name: "Trapcode Suite 2024", link: "#", isNew: true },
          { name: "Magic Bullet Suite 2024", link: "#" },
          { name: "Universe 2024", link: "#" },
        ],
      },
      {
        title: "Video Copilot",
        icon: "🚀",
        color: "#FF9900",
        versions: [
          { name: "Element 3D v2.2", link: "#" },
          { name: "Optical Flares", link: "#" },
          { name: "Saber Plugin", link: "#" },
        ],
      },
    ],
    "Premiere Pro Plugins": [
      {
        title: "Boris FX",
        icon: "🔵",
        color: "#4488FF",
        versions: [
          { name: "Continuum 2024", link: "#", isNew: true },
          { name: "Sapphire 2024", link: "#" },
          { name: "Mocha Pro 2024", link: "#" },
        ],
      },
    ],
  },
  assets: {
    "Stock Footage": [
      {
        title: "4K Cinematic Pack",
        icon: "📽️",
        color: "#FACC15",
        versions: [
          { name: "Download Pack 1 (2.5GB)", link: "#" },
          { name: "Download Pack 2 (3.1GB)", link: "#" },
        ],
      },
    ],
    "LUTs & Color Grading": [
      {
        title: "Professional LUT Pack",
        icon: "🎨",
        color: "#FF6B6B",
        versions: [
          { name: "Cinematic LUTs (50 Files)", link: "#" },
          { name: "Wedding LUTs (30 Files)", link: "#" },
          { name: "Travel LUTs (40 Files)", link: "#" },
        ],
      },
    ],
    "Motion Graphics": [
      {
        title: "Titles & Lower Thirds",
        icon: "✨",
        color: "#9B59B6",
        versions: [
          { name: "100+ Title Templates", link: "#" },
          { name: "Social Media Pack", link: "#" },
        ],
      },
    ],
  },
}

type Category = "softwares" | "plugins" | "assets" | "introduction" | "faq"

export default function FreeFilesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("introduction")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Windows Softwares")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null)

  const passwords = ["123", "EDITING", "M2STUDIO"]

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password)
    setCopiedPassword(password)
    setTimeout(() => setCopiedPassword(null), 2000)
  }

  const currentData =
    selectedCategory === "softwares" || selectedCategory === "plugins" || selectedCategory === "assets"
      ? freeFilesData[selectedCategory]
      : null
  const subcategoryData = currentData ? currentData[selectedSubcategory as keyof typeof currentData] || [] : []

  const handleNavClick = (category: Category, subcategory?: string) => {
    setSelectedCategory(category)
    if (subcategory) setSelectedSubcategory(subcategory)
    setSidebarOpen(false)
  }

  const NavItem = ({
    label,
    category,
    subcategory,
    icon: Icon,
  }: {
    label: string
    category: Category
    subcategory?: string
    icon?: any
  }) => {
    const isActive = subcategory
      ? selectedCategory === category && selectedSubcategory === subcategory
      : selectedCategory === category

    return (
      <button
        onClick={() => handleNavClick(category, subcategory)}
        className={`text-sm w-full text-left py-3 px-4 rounded-xl transition-all flex items-center gap-3 group ${
          isActive
            ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30"
            : "hover:bg-white/5 border border-transparent"
        }`}
        style={{
          color: isActive ? "#FACC15" : "#9CA3AF",
        }}
      >
        {Icon && (
          <div
            className={`p-1.5 rounded-lg transition-all ${isActive ? "bg-yellow-500/20" : "bg-white/5 group-hover:bg-white/10"}`}
          >
            <Icon size={16} className={isActive ? "text-yellow-500" : "text-gray-400 group-hover:text-white"} />
          </div>
        )}
        <span className="flex-1 font-medium">{label}</span>
        {isActive && <ChevronRight size={14} className="text-yellow-500" />}
      </button>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardNav />
      <div className="min-h-screen bg-background pt-16">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Fixed sidebar positioning */}
        <aside
          className={`w-72 h-[calc(100vh-64px)] p-5 fixed left-0 top-16 z-50 overflow-y-auto transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          style={{
            background: "linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(5,5,5,0.98) 100%)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X size={20} />
          </button>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <Input
              placeholder="Search resources..."
              className="pl-11 py-5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 focus:bg-white/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="space-y-6 pb-8">
            <div>
              <h3 className="text-[11px] font-bold mb-3 uppercase tracking-widest text-gray-500 px-4">Get Started</h3>
              <NavItem label="Introduction" category="introduction" icon={BookOpen} />
            </div>

            <div>
              <h3 className="text-[11px] font-bold mb-3 uppercase tracking-widest text-gray-500 px-4">Softwares</h3>
              <div className="space-y-1">
                <NavItem
                  label="Windows Softwares"
                  category="softwares"
                  subcategory="Windows Softwares"
                  icon={Monitor}
                />
                <NavItem label="Mac Softwares" category="softwares" subcategory="Mac Softwares" icon={Apple} />
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold mb-3 uppercase tracking-widest text-gray-500 px-4">Plugins</h3>
              <div className="space-y-1">
                <NavItem
                  label="After Effects Plugins"
                  category="plugins"
                  subcategory="After Effects Plugins"
                  icon={Puzzle}
                />
                <NavItem
                  label="Premiere Pro Plugins"
                  category="plugins"
                  subcategory="Premiere Pro Plugins"
                  icon={Puzzle}
                />
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold mb-3 uppercase tracking-widest text-gray-500 px-4">Assets</h3>
              <div className="space-y-1">
                <NavItem label="Stock Footage" category="assets" subcategory="Stock Footage" icon={Film} />
                <NavItem
                  label="LUTs & Color Grading"
                  category="assets"
                  subcategory="LUTs & Color Grading"
                  icon={Palette}
                />
                <NavItem label="Motion Graphics" category="assets" subcategory="Motion Graphics" icon={Layers} />
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold mb-3 uppercase tracking-widest text-gray-500 px-4">Support</h3>
              <NavItem label="FAQ" category="faq" icon={HelpCircle} />
            </div>
          </nav>
        </aside>

        {/* Push content when sidebar is visible */}
        <main className="lg:ml-72 min-h-[calc(100vh-64px)]">
          {/* Mobile Menu Button */}
          <div className="lg:hidden sticky top-16 z-30 p-4 glass border-b border-border">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <Menu size={20} />
              <span>Browse Categories</span>
            </button>
          </div>

          <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
            {selectedCategory === "introduction" && (
              <div className="space-y-10">
                {/* Password Alert Banner */}
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-yellow-500/10 border border-yellow-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-[60px]" />
                  <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Lock className="text-yellow-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Key size={16} className="text-yellow-500" />
                          Password Protected Files
                        </h3>
                        <p className="text-sm text-gray-400">All softwares, plugins & assets are password protected:</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:ml-auto">
                      {passwords.map((pwd) => (
                        <button
                          key={pwd}
                          onClick={() => copyPassword(pwd)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 border border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all group"
                        >
                          <code className="text-yellow-500 font-bold">{pwd}</code>
                          {copiedPassword === pwd ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} className="text-gray-500 group-hover:text-yellow-500 transition-colors" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hero Banner */}
                <div
                  className="relative overflow-hidden rounded-3xl p-8 md:p-12"
                  style={{
                    background: "linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px]" />

                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
                      <Sparkles className="text-yellow-500" size={16} />
                      <span className="text-yellow-500 font-semibold text-sm">100% Free Resources</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                      Professional Tools,
                      <br />
                      <span className="text-yellow-500">Zero Cost</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8 leading-relaxed">
                      Access premium video editing software, plugins, and assets. Everything you need to create stunning
                      content, completely free.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => handleNavClick("softwares", "Windows Softwares")}
                        className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 group"
                      >
                        Browse Resources
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <Link
                        href="#"
                        className="px-6 py-3 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
                      >
                        <Users size={18} />
                        Join Discord
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "50+", label: "Software & Plugins", icon: Download },
                    { value: "1000+", label: "Happy Users", icon: Users },
                    { value: "24/7", label: "Discord Support", icon: Clock },
                    { value: "100%", label: "Free Forever", icon: Shield },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-2xl text-center glass border-border">
                      <stat.icon className="mx-auto mb-3 text-yellow-500" size={24} />
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Category Cards */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Browse Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      {
                        icon: Monitor,
                        title: "Softwares",
                        desc: "Adobe Suite, Final Cut Pro, DaVinci Resolve & more",
                        color: "#3B82F6",
                        count: "15+",
                        category: "softwares" as Category,
                        subcategory: "Windows Softwares",
                      },
                      {
                        icon: Puzzle,
                        title: "Plugins",
                        desc: "Red Giant, Video Copilot, Boris FX plugins",
                        color: "#8B5CF6",
                        count: "20+",
                        category: "plugins" as Category,
                        subcategory: "After Effects Plugins",
                      },
                      {
                        icon: Palette,
                        title: "Assets",
                        desc: "LUTs, Templates, Stock Footage & Graphics",
                        color: "#EC4899",
                        count: "100+",
                        category: "assets" as Category,
                        subcategory: "Stock Footage",
                      },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleNavClick(item.category, item.subcategory)}
                        className="p-6 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer group text-left glass border-border hover:border-yellow-500/30"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <item.icon size={28} style={{ color: item.color }} />
                          </div>
                          <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-white/5 text-gray-400">
                            {item.count}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                        <div className="mt-4 flex items-center gap-2 text-yellow-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore <ArrowRight size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* How to Download - Enhanced */}
                <div
                  className="p-8 md:p-10 rounded-2xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(250,204,21,0.08) 0%, rgba(250,204,21,0.02) 100%)",
                    border: "1px solid rgba(250,204,21,0.2)",
                  }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 rounded-lg bg-yellow-500/20">
                        <Zap className="text-yellow-500" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">How to Download</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { step: "01", title: "Browse", text: "Explore our categories" },
                        { step: "02", title: "Select", text: "Click on your resource" },
                        { step: "03", title: "Join", text: "Connect via Discord" },
                        { step: "04", title: "Download", text: "Get password & enjoy" },
                      ].map((item, i) => (
                        <div key={i} className="relative">
                          <div className="text-6xl font-black text-yellow-500/10 absolute -top-2 -left-2">
                            {item.step}
                          </div>
                          <div className="relative pt-8 pl-2">
                            <h3 className="text-lg font-bold text-yellow-500 mb-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.text}</p>
                          </div>
                          {i < 3 && (
                            <div className="hidden md:block absolute top-1/2 -right-3 text-yellow-500/30">
                              <ArrowRight size={20} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Discord CTA */}
                <div className="p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 glass border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.077.077 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Join Our Community</h3>
                      <p className="text-gray-400">Get passwords, support, and early access to new files</p>
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="px-8 py-4 bg-[#5865F2] text-white font-semibold rounded-xl hover:bg-[#4752C4] transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    Join Discord
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </div>
            )}

            {/* Software/Plugin Cards Section */}
            {selectedCategory !== "introduction" && (
              <div className="space-y-8">
                {/* Password Reminder Banner */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <Lock size={18} className="text-yellow-500 shrink-0" />
                  <p className="text-sm text-gray-300">
                    <span className="text-yellow-500 font-semibold">Password Protected:</span> Use{" "}
                    {passwords.map((pwd, i) => (
                      <span key={pwd}>
                        <code className="px-1.5 py-0.5 rounded bg-black/50 text-yellow-500 font-bold text-xs">
                          {pwd}
                        </code>
                        {i < passwords.length - 1 && <span className="text-gray-500"> or </span>}
                      </span>
                    ))}{" "}
                    to extract files
                  </p>
                </div>

                {/* Breadcrumb */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="font-semibold text-white">Home</span>
                  <ChevronRight size={16} className="text-gray-500" />
                  <span className="font-semibold text-white">{selectedCategory}</span>
                  {selectedSubcategory && (
                    <>
                      <ChevronRight size={16} className="text-gray-500" />
                      <span className="font-semibold text-white">{selectedSubcategory}</span>
                    </>
                  )}
                </div>

                {/* Cards */}
                <div className="space-y-5">
                  {subcategoryData.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl transition-all overflow-hidden glass border-border hover:border-yellow-500/30"
                    >
                      {/* Card Header */}
                      <button
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        className="w-full p-6 flex items-center gap-5 text-left"
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                          style={{ backgroundColor: `${item.color}15`, boxShadow: `0 0 30px ${item.color}10` }}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.versions.length} versions available</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.versions.some((v: any) => v.isNew) && (
                            <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-black">
                              NEW
                            </span>
                          )}
                          <ChevronRight
                            size={20}
                            className={`text-gray-500 transition-transform ${expandedCard === index ? "rotate-90" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Expanded Content */}
                      <div
                        className={`grid transition-all ${expandedCard === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-6 pb-6 pt-2 border-t border-white/5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {item.versions.map((version: any, vIndex: number) => (
                                <Link
                                  key={vIndex}
                                  href={version.link}
                                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] group bg-white/5 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/30"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                      <Download
                                        size={14}
                                        className="text-gray-400 group-hover:text-yellow-500 transition-colors"
                                      />
                                    </div>
                                    <span className="text-gray-200 text-sm font-medium">{version.name}</span>
                                  </div>
                                  {version.isNew && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-yellow-500 text-black">
                                      NEW
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="p-8 rounded-2xl text-center glass border-border">
                  <h3 className="text-xl font-bold text-white mb-2">Need something else?</h3>
                  <p className="text-gray-400 mb-6">Request files in our Discord community</p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-all"
                  >
                    Request Files
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </div>
            )}

            {selectedCategory === "faq" && (
              <div className="space-y-8">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
                    <HelpCircle className="text-yellow-500" size={16} />
                    <span className="text-yellow-500 font-semibold text-sm">Support</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
                  <p className="text-xl text-gray-400">Everything you need to know about our free resources</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      q: "Are these files really free?",
                      a: "Yes! All files are completely free. Join our Discord to get the password for protected files.",
                    },
                    {
                      q: "How do I get the download password?",
                      a: "Join our Discord server using the link provided. The password is shared in the #downloads channel, pinned at the top.",
                    },
                    {
                      q: "Are the software files safe to use?",
                      a: "Yes, all files are thoroughly tested before uploading. However, we always recommend scanning with your antivirus before installation.",
                    },
                    {
                      q: "Can I use these for commercial projects?",
                      a: "For software, please follow the original license terms. Assets like LUTs and templates are free for both personal and commercial use.",
                    },
                    {
                      q: "How often do you add new files?",
                      a: "We update our library regularly with new software versions and assets. Join our Discord to get notified when new files are uploaded.",
                    },
                    {
                      q: "What if a download link is broken?",
                      a: "Please report broken links in our Discord server's #support channel. We'll fix them as soon as possible.",
                    },
                  ].map((faq, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl transition-all hover:border-yellow-500/30 glass border-border"
                    >
                      <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                        <span className="text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2.5 py-1.5 rounded-lg">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.q}
                      </h3>
                      <p className="text-gray-400 leading-relaxed pl-12">{faq.a}</p>
                    </div>
                  ))}
                </div>

                {/* Contact Support */}
                <div className="p-8 rounded-2xl text-center glass border-border">
                  <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
                  <p className="text-gray-400 mb-6">Our team is here to help you</p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-all"
                  >
                    Contact Support
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
