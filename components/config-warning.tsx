"use client"

import * as React from "react"
import { isConfigValid } from "@/lib/firebase"

export function ConfigWarning() {
  if (isConfigValid) return null

  return (
    <div style={{ background: "#111", color: "#FACC15" }} className="w-full text-center py-2">
      <strong>Firebase configuration incomplete.</strong> Please set NEXT_PUBLIC_FIREBASE_* environment variables and redeploy.
    </div>
  )
}
