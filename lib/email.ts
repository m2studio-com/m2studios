export async function sendClientEmail({ to, subject, type, data }: { to: string; subject: string; type: string; data: any }) {
  // Best-effort server-side helper that delegates to the existing send-email API route.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  const res = await fetch(`${baseUrl}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, type, data }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`send-email failed: ${res.status} ${body}`)
  }

  return res.json()
}
