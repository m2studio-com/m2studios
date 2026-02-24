"use client"

import { AnimatedBackground } from "@/components/animated-background"
import { DashboardNav } from "@/components/dashboard-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileVideo, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

const deliveredFiles = [
  {
    name: "Wedding_Film_Final_4K.mp4",
    size: "2.4 GB",
    type: "video/mp4",
    downloadUrl: "#",
  },
  {
    name: "Wedding_Film_1080p.mp4",
    size: "890 MB",
    type: "video/mp4",
    downloadUrl: "#",
  },
  {
    name: "Highlight_Reel.mp4",
    size: "450 MB",
    type: "video/mp4",
    downloadUrl: "#",
  },
]

export default function DownloadFilesPage() {
  const handleDownload = (file: (typeof deliveredFiles)[0]) => {
    // TODO: Implement Firebase Storage download
    // const storage = getStorage()
    // const fileRef = ref(storage, file.downloadUrl)
    // const url = await getDownloadURL(fileRef)
    // window.open(url, '_blank')

    console.log("Downloading:", file.name)
  }

  const handleDownloadAll = () => {
    deliveredFiles.forEach((file) => handleDownload(file))
  }

  return (
    <>
      <ProtectedRoute>
        <AnimatedBackground />
        <DashboardNav userRole="client" />

        <main className="min-h-screen pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-foreground">Download Files</h1>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-muted-foreground">Order #ORD-001 - Wedding Film Editing (Delivered)</p>
            </div>

            <Card className="glass border-border p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your files are ready!</h3>
                  <p className="text-muted-foreground">Download your edited videos below</p>
                </div>
                <Button
                  onClick={handleDownloadAll}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue"
                >
                  <Download size={18} className="mr-2" />
                  Download All
                </Button>
              </div>

              <div className="space-y-3">
                {deliveredFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileVideo className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(file)}
                      variant="outline"
                      className="border-border hover:border-primary ml-4"
                    >
                      <Download size={18} className="mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-6 pt-6">
                <p className="text-sm text-muted-foreground">
                  Files will be available for download for 30 days. Please save them to your device.
                </p>
              </div>
            </Card>

            {/* Feedback Card */}
            <Card className="glass border-border p-8 mt-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">How was your experience?</h3>
              <p className="text-muted-foreground mb-6">We'd love to hear your feedback on this project</p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Leave a Review
              </Button>
            </Card>
          </div>
        </main>
      </ProtectedRoute>
    </>
  )
}
