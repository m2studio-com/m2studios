"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useAuth } from "@/lib/auth-context"
import type { ReviewDocument } from "@/lib/firestore-types"

interface ReviewModalProps {
  orderId: string
  serviceType: string
  onClose: () => void
  onSubmit: () => void
}

export function ReviewModal({ orderId, serviceType, onClose, onSubmit }: ReviewModalProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user || !db || rating === 0) return

    setSubmitting(true)
    try {
      const reviewData: ReviewDocument = {
        orderId,
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        userEmail: user.email || "",
        rating,
        review,
        serviceType,
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, "reviews"), reviewData)
      onSubmit()
      onClose()
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <Card className="w-full max-w-lg bg-[#0E0E0E] border-[#FACC15]/30 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">Rate Your Experience</h2>
            <p className="text-[#9CA3AF]">How was your experience with {serviceType}?</p>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#FFFFFF]">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={40}
                  style={{
                    fill: (hoveredRating || rating) >= star ? "#FACC15" : "transparent",
                    color: (hoveredRating || rating) >= star ? "#FACC15" : "#9CA3AF",
                  }}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">Your Review (Optional)</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with M2 Studio..."
              rows={4}
              className="bg-[#050505] border-[#1a1a1a] text-[#FFFFFF] placeholder:text-[#6B7280]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[#1a1a1a] text-[#FFFFFF] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="flex-1 bg-[#FACC15] hover:bg-[#FACC15]/90 text-[#050505]"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
