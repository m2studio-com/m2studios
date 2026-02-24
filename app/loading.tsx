export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-6">
        {/* M2 Studio Animated Logo */}
        <div className="relative">
          {/* Outer ring */}
          <div className="h-20 w-20 rounded-full border-2 border-yellow-400/20" />
          {/* Spinning ring */}
          <div
            className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-yellow-400 border-r-yellow-400/50"
            style={{ animationDuration: "1s" }}
          />
          {/* Inner logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">
              <span className="text-yellow-400">M2</span>
            </span>
          </div>
        </div>
        {/* Pulsing text */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold text-white">M2 Studio</span>
          <span className="text-sm text-gray-400 animate-pulse">Loading amazing content...</span>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
