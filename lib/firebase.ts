// Firebase configuration and initialization
// NOTE: avoid importing `firebase/app` at module top-level so server-side
// builds (Next 16) don't evaluate browser-only SDK code. We'll lazily
// require `firebase/app` inside the client-only block below.
let initializeApp: any = null
let getApps: any = null

// Client-only Firebase initialization. This file can be safely imported on the
// server without triggering browser-only SDK initialization.
let app: any = null
let auth: any = null
let storage: any = null
let db: any = null
let googleProvider: any = null
let googleProviderAvailable = false

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Normalize common storageBucket values (some envs use `.firebasestorage.app`)
if (firebaseConfig.storageBucket && firebaseConfig.storageBucket.endsWith(".firebasestorage.app")) {
  try {
    firebaseConfig.storageBucket = firebaseConfig.storageBucket.replace(".firebasestorage.app", ".appspot.com")
    // keep a console hint for debugging
    // eslint-disable-next-line no-console
    console.info("[Firebase] Normalized storageBucket to:", firebaseConfig.storageBucket)
  } catch (e) {
    // ignore
  }
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
  try {
    // Lazily require firebase/app in the browser to avoid server-side errors
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const firebaseApp = require("firebase/app")
    initializeApp = firebaseApp.initializeApp
    getApps = firebaseApp.getApps

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

    try {
      auth = getAuth(app)
    } catch (err) {
      console.warn("[Firebase] getAuth failed:", err)
      auth = null
    }

    try {
      // getStorage may throw in environments where storage service isn't available
      storage = getStorage ? getStorage(app) : null
    } catch (err) {
      console.warn("[Firebase] getStorage failed or storage not available:", err)
      storage = null
    }

    try {
      db = getFirestore(app)
    } catch (err) {
      console.warn("[Firebase] getFirestore failed:", err)
      db = null
    }

    try {
      googleProvider = new GoogleAuthProvider()
      googleProviderAvailable = true
    } catch (err) {
      console.warn("[Firebase] GoogleAuthProvider initialization failed:", err)
      googleProvider = null
      googleProviderAvailable = false
    }

    // Connect to local emulators when enabled (useful for local testing)
    try {
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && db && auth) {
        const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || "localhost:8080"
        const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || "http://localhost:9099"
        const [host, portStr] = firestoreHost.split(":")
        const port = parseInt(portStr || "8080", 10)
        connectFirestoreEmulator(db, host, port)
        connectAuthEmulator(auth, authEmulatorUrl)
        console.info("[Firebase] Connected to emulators:", { firestoreHost, authEmulatorUrl })
      }
    } catch (emErr) {
      console.warn("[Firebase] Could not connect to emulators:", emErr)
    }

    // Set session persistence if auth is available
    if (auth && typeof setPersistence === "function") {
      setPersistence(auth, browserSessionPersistence).catch((error: any) => {
        console.error("[Firebase] Error setting session persistence:", error)
      })
    }
  } catch (initErr) {
    // Defensive: any failure during client initialization should not crash module evaluation
    // This avoids the black screen by allowing the app to render and surface errors in console.
    // eslint-disable-next-line no-console
    console.error("[Firebase] Client initialization error (non-fatal):", initErr)
    app = null
    auth = null
    storage = null
    db = null
    googleProvider = null
  }
}

// Helper to lazily initialize googleProvider if it's null (for resilience)
export function getGoogleProvider() {
  if (googleProvider && googleProviderAvailable) return googleProvider

  if (typeof window === "undefined") {
    console.warn("[Firebase] Cannot get Google provider: not in browser")
    return null
  }

  try {
    console.info("[Firebase] Attempting to initialize Google provider on-demand...")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { GoogleAuthProvider } = require("firebase/auth")
    if (!GoogleAuthProvider) {
      console.error("[Firebase] GoogleAuthProvider class not found in firebase/auth")
      googleProviderAvailable = false
      return null
    }
    console.info("[Firebase] Creating new GoogleAuthProvider instance...")
    googleProvider = new GoogleAuthProvider()
    googleProviderAvailable = true
    console.info("[Firebase] Google provider initialized on-demand successfully")
    return googleProvider
  } catch (err) {
    console.error("[Firebase] Failed to initialize Google provider on-demand:", err, (err as any)?.message || "")
    googleProvider = null
    googleProviderAvailable = false
    return null
  }
}

export function isGoogleProviderAvailable() {
  return googleProviderAvailable || !!googleProvider
}

export { auth, storage, db, isConfigValid, googleProvider }
export default app
