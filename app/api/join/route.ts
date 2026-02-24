import { NextResponse } from "next/server"

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    // Validate required fields
    const requiredFields = ["fullName", "email", "phone", "device", "software", "position", "whyJoin", "durability"]
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate email format
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const googleSheetsWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    if (googleSheetsWebhook) {
      try {
        await fetch(googleSheetsWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            Device: formData.device, // Capital D to match Apps Script
            software: formData.software,
            position: formData.position,
            portfolio: formData.portfolio || "N/A",
            whyJoin: formData.whyJoin,
            durability: formData.durability,
          }),
        })
      } catch (error) {
        console.error("Google Sheets error:", error)
      }
    }

    const discordWebhook = process.env.DISCORD_APPLICATION_WEBHOOK_URL
    if (discordWebhook) {
      try {
        await fetch(discordWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content:
              "<@&1449513575918997584> <@&1449513702419075092> <@&1449513679128236115> New application received!",
            embeds: [
              {
                title: "🎬 New M2 Studio Application",
                color: 0xfacc15, // Yellow color
                fields: [
                  {
                    name: "👤 Name",
                    value: formData.fullName,
                    inline: true,
                  },
                  {
                    name: "📧 Email",
                    value: formData.email,
                    inline: true,
                  },
                  {
                    name: "📱 Phone",
                    value: formData.phone,
                    inline: true,
                  },
                  {
                    name: "💻 Device",
                    value: formData.device,
                    inline: true,
                  },
                  {
                    name: "🛠️ Software",
                    value: formData.software,
                    inline: true,
                  },
                  {
                    name: "🎯 Position",
                    value: formData.position,
                    inline: true,
                  },
                  {
                    name: "🔗 Portfolio",
                    value: formData.portfolio || "Not provided",
                    inline: false,
                  },
                  {
                    name: "💭 Why Join",
                    value: formData.whyJoin.substring(0, 1024),
                    inline: false,
                  },
                  {
                    name: "⏱️ Durability",
                    value: formData.durability,
                    inline: true,
                  },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                  text: "M2 Studio Applications",
                },
              },
            ],
          }),
        })
      } catch (error) {
        console.error("Discord webhook error:", error)
      }
    }

    return NextResponse.json({ success: true, message: "Application submitted successfully!" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
