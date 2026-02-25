"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

import { auth, db, googleProvider, isConfigValid } from "./firebase"

// User type
interface User {
  uid: string
  email: string | null
  displayName?: string | null
}

// Context type
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigValid) {
      console.error("[Auth] Firebase not configured properly.")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Email login
  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password required")
    await signInWithEmailAndPassword(auth, email, password)
  }

  // Email signup
  const signup = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password required")

    const result = await createUserWithEmailAndPassword(auth, email, password)

    // Create Firestore user document
    await setDoc(doc(db, "users", result.user.uid), {
      email: result.user.email,
      createdAt: new Date(),
    })
  }

  // Google login
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)

    // Create Firestore user doc if not exists
    const userRef = doc(db, "users", result.user.uid)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        email: result.user.email,
        displayName: result.user.displayName,
        createdAt: new Date(),
      })
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}