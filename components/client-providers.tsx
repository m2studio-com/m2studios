"use client"

import * as React from "react"
import { AuthProvider } from "@/lib/auth-context"

class ClientErrorBoundary extends React.Component<{
  children: React.ReactNode
}, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console so it appears in browser/dev logs
    // keeping this minimal for debugging purposes
    // eslint-disable-next-line no-console
    console.error("Client error:", error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: "#000",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          boxSizing: "border-box",
        }}>
          <div style={{ maxWidth: 900 }}>
            <h1 style={{ color: "#FACC15", marginBottom: 12 }}>Client error</h1>
            <pre style={{ whiteSpace: "pre-wrap", color: "#ddd" }}>{String(this.state.error)}
{(this.state.error as any)?.stack}</pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClientErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ClientErrorBoundary>
  )
}
