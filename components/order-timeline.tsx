"use client"

import { CheckCircle, Clock, PackageCheck, XCircle } from "lucide-react"
import type { StatusHistoryEntry } from "@/lib/firestore-types"

interface OrderTimelineProps {
  statusHistory: StatusHistoryEntry[]
  currentStatus: string
}

export function OrderTimeline({ statusHistory, currentStatus }: OrderTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />
      case "working":
        return <PackageCheck className="w-5 h-5" />
      case "delivered":
        return <CheckCircle className="w-5 h-5" />
      case "cancelled":
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/50"
      case "working":
        return "text-blue-400 bg-blue-500/10 border-blue-500/50"
      case "delivered":
        return "text-green-400 bg-green-500/10 border-green-500/50"
      case "cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/50"
      default:
        return "text-[#9CA3AF] bg-[#1a1a1a] border-[#1a1a1a]"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Placed"
      case "working":
        return "In Progress"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {statusHistory.map((entry, index) => {
        const isLatest = index === statusHistory.length - 1
        const statusColor = getStatusColor(entry.status)

        return (
          <div key={index} className="relative pl-8">
            {/* Timeline line */}
            {index < statusHistory.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-[#1a1a1a]" />
            )}

            {/* Timeline node */}
            <div
              className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${statusColor} ${
                isLatest ? "ring-4 ring-[#1a1a1a]" : ""
              }`}
            >
              {getStatusIcon(entry.status)}
            </div>

            {/* Timeline content */}
            <div className={`pb-6 ${isLatest ? "bg-[#1a1a1a] p-4 rounded-lg border border-[#1a1a1a]" : ""}`}>
              <div className="flex items-start justify-between mb-1">
                <h4 className={`font-semibold ${isLatest ? "text-[#FFFFFF]" : "text-[#9CA3AF]"}`}>
                  {getStatusLabel(entry.status)}
                </h4>
                {isLatest && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/50">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-[#9CA3AF] mb-2">{formatTimestamp(entry.timestamp)}</p>
              {entry.updatedByName && (
                <p className="text-xs text-[#9CA3AF]">
                  Updated by: <span className="text-[#FFFFFF]">{entry.updatedByName}</span>
                </p>
              )}
              {entry.note && (
                <p className="text-sm text-[#FFFFFF] mt-2 p-3 bg-[#050505] rounded border border-[#1a1a1a]">
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
