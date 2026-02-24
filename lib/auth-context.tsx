"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db, isConfigValid, googleProvider } from "./firebase"

// User type
interface User {
  uid: string
  email: string | null
  displayName: string | null
  role: "client" | "admin"
  photoURL?: string
  provider?: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigValid || !auth) {
      console.error("[Auth] Firebase is not properly configured. Please check environment variables.")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          if (!db) {
            console.error("[Firebase] Firestore is not configured.")
            setUser(null)
            setLoading(false)
            return
          }

          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          const userData = userDoc.data()

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: userData?.role || "client",
            photoURL: userData?.photoURL,
            provider: userData?.provider,
          })
        } catch (error) {
          console.error("[Firebase] Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isConfigValid || !auth) {
      throw new Error("Firebase is not configured. Please ensure all Firebase environment variables are set correctly.")
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error("[v0] Firebase sign in error:", error.code, error.message)
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email address.")
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password. Please try again.")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address format.")
      } else if (error.code === "auth/user-disabled") {
        throw new Error("This account has been disabled.")
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many failed attempts. Please try again later.")
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("Invalid email or password. Please check your credentials.")
      } else if (error.code === "auth/network-request-failed") {
        throw new Error("Network error. Please check your internet connection.")
      } else {
        throw new Error(error.message || "Failed to sign in. Please try again.")
      }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!isConfigValid || !auth || !db) {
      throw new Error("Firebase is not configured. Please ensure all Firebase environment variables are set correctly.")
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, { displayName: name })

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: name,
        role: "client",
        createdAt: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error("[v0] Firebase sign up error:", error.code, error.message)
      if (error.code === "auth/email-already-in-use") {
        throw new Error("This email is already registered. Please sign in instead.")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address format.")
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password is too weak. Please use at least 6 characters.")
      } else if (error.code === "auth/network-request-failed") {
        throw new Error("Network error. Please check your internet connection.")
      } else {
        throw new Error(error.message || "Failed to create account. Please try again.")
      }
    }
  }

  const signInWithGoogle = async () => {
    if (!isConfigValid || !auth || !db) {
      throw new Error("Firebase is not configured. Please ensure all Firebase environment variables are set correctly.")
    }

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "client",
          createdAt: new Date().toISOString(),
          provider: "google",
        })
      }
    } catch (error: any) {
      console.error("[Firebase] Google sign in error:", error.code, error.message)
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in popup was closed. Please try again.")
      } else if (error.code === "auth/popup-blocked") {
        throw new Error("Sign-in popup was blocked. Please allow popups for this site.")
      } else if (error.code === "auth/cancelled-popup-request") {
        throw new Error("Sign-in was cancelled. Please try again.")
      } else if (error.code === "auth/network-request-failed") {
        throw new Error("Network error. Please check your internet connection.")
      } else {
        throw new Error(error.message || "Failed to sign in with Google. Please try again.")
      }
    }
  }

  const signOut = async () => {
    if (!auth) {
      throw new Error("Firebase Auth is not configured.")
    }

    try {
      await firebaseSignOut(auth)
      setUser(null)

      // Clear caches safely
      if (typeof window !== "undefined") {
        try {
          if ("caches" in window) {
            const cacheNames = await caches.keys()
            await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
          }
        } catch (cacheError) {
          console.warn("[Cache] Could not clear caches:", cacheError)
        }

        // Clear storage
        try {
          localStorage.clear()
          sessionStorage.clear()
        } catch (storageError) {
          console.warn("[Storage] Could not clear storage:", storageError)
        }
      }
    } catch (error: any) {
      console.error("[Firebase] Sign out error:", error)
      throw new Error(error.message || "Failed to sign out")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
