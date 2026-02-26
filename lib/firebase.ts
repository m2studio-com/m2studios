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
  ;(async () => {
    try {
      // Use dynamic imports (ESM) consistently to avoid multiple SDK instances
      const firebaseApp = await import("firebase/app")
      initializeApp = firebaseApp.initializeApp
      getApps = firebaseApp.getApps

      const authModule = await import("firebase/auth")
      const storageModule = await import("firebase/storage")
      const firestoreModule = await import("firebase/firestore")

      const { getAuth, browserSessionPersistence, setPersistence, GoogleAuthProvider } = authModule
      const { getStorage } = storageModule
      const { getFirestore, connectFirestoreEmulator } = firestoreModule

      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

      try {
        auth = getAuth(app)
      } catch (err) {
        console.warn("[Firebase] getAuth failed:", err)
        auth = null
      }

      try {
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

      try {
        if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && db && auth) {
          const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || "localhost:8080"
          const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || "http://localhost:9099"
          const [host, portStr] = firestoreHost.split(":")
          const port = parseInt(portStr || "8080", 10)
          connectFirestoreEmulator(db, host, port)
          const { connectAuthEmulator } = authModule
          connectAuthEmulator(auth, authEmulatorUrl)
          console.info("[Firebase] Connected to emulators:", { firestoreHost, authEmulatorUrl })
        }
      } catch (emErr) {
        console.warn("[Firebase] Could not connect to emulators:", emErr)
      }

      if (auth && typeof setPersistence === "function") {
        setPersistence(auth, browserSessionPersistence).catch((error: any) => {
          console.error("[Firebase] Error setting session persistence:", error)
        })
      }
    } catch (initErr) {
      console.error("[Firebase] Client initialization error (non-fatal):", initErr)
      app = null
      auth = null
      storage = null
      db = null
      googleProvider = null
    }
  })()
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

// Safe async getter for Firestore client to ensure `db` is initialized
export async function getFirestoreClient() {
  if (db) return db
  if (typeof window === "undefined") return null

  try {
    // Use dynamic import to match bundler ESM instances
    const firebaseApp = await import("firebase/app")
    const firebaseFirestore = await import("firebase/firestore")

    const init = firebaseApp.initializeApp
    const apps = firebaseApp.getApps
    const _app = apps().length === 0 ? init(firebaseConfig) : apps()[0]
    app = _app
    db = firebaseFirestore.getFirestore(app)
    return db
  } catch (err) {
    console.error("[Firebase] getFirestoreClient error:", err)
    return null
  }
}
