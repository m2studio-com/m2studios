// Firebase configuration and initialization
import { initializeApp, getApps } from "firebase/app"

// Client-only Firebase initialization. This file can be safely imported on the
// server without triggering browser-only SDK initialization.
let app: any = null
let auth: any = null
let storage: any = null
let db: any = null
let googleProvider: any = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Validate Firebase configuration (non-blocking)
const isConfigValid = Object.values(firebaseConfig).every((value) => value && value !== "")
if (!isConfigValid && typeof window !== "undefined") {
  console.error("[Firebase] Configuration Error: Missing environment variables.")
  console.error(
    "[Firebase] Please ensure all NEXT_PUBLIC_FIREBASE_* environment variables are set in your project settings.",
  )
  console.error("[Firebase] Current config:", {
    apiKey: firebaseConfig.apiKey ? "SET" : "MISSING",
    authDomain: firebaseConfig.authDomain ? "SET" : "MISSING",
    projectId: firebaseConfig.projectId ? "SET" : "MISSING",
    storageBucket: firebaseConfig.storageBucket ? "SET" : "MISSING",
    messagingSenderId: firebaseConfig.messagingSenderId ? "SET" : "MISSING",
    appId: firebaseConfig.appId ? "SET" : "MISSING",
  })
}

if (typeof window !== "undefined") {
  // Import browser-only parts inside the client block to avoid server-side
  // initialization errors during SSR or in API routes.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getAuth, browserSessionPersistence, setPersistence, GoogleAuthProvider } = require("firebase/auth")
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getStorage } = require("firebase/storage")
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getFirestore, connectFirestoreEmulator } = require("firebase/firestore")
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { connectAuthEmulator } = require("firebase/auth")

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  storage = getStorage(app)
  db = getFirestore(app)
  googleProvider = new GoogleAuthProvider()

  // Connect to local emulators when enabled (useful for local testing)
  try {
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
      // Default emulator hosts and ports
      const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || "localhost:8080"
      const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || "http://localhost:9099"

      // connectFirestoreEmulator expects (db, host, port)
      const [host, portStr] = firestoreHost.split(":")
      const port = parseInt(portStr || "8080", 10)
      connectFirestoreEmulator(db, host, port)

      // connectAuthEmulator expects (auth, url)
      connectAuthEmulator(auth, authEmulatorUrl)

      console.info("[Firebase] Connected to emulators:", { firestoreHost, authEmulatorUrl })
    }
  } catch (emErr) {
    console.warn("[Firebase] Could not connect to emulators:", emErr)
  }

  setPersistence(auth, browserSessionPersistence).catch((error: any) => {
    console.error("[Firebase] Error setting session persistence:", error)
  })
}

export { auth, storage, db, isConfigValid, googleProvider }
export default app
