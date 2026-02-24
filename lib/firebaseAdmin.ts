import * as admin from "firebase-admin"

let adminApp: admin.app.App | null = null

if (!admin.apps.length) {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // If a path to a service account JSON is provided via
    // GOOGLE_APPLICATION_CREDENTIALS, the SDK will use it automatically.
    adminApp = admin.initializeApp()
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      })
    } catch (err) {
      console.error("[v0] Failed to parse FIREBASE_SERVICE_ACCOUNT:", err)
    }
  } else {
    console.warn("[v0] No Firebase admin credentials found in environment")
  }
} else {
  adminApp = admin.app()
}

const adminDb = adminApp ? adminApp.firestore() : null

export { adminApp, adminDb }
