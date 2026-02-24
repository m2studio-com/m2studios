"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Shield,
  X,
  Check,
  Pencil,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { AnimatedBackground } from "@/components/animated-background"

export default function ProfilePage() {
  const { user } = useAuth()

  // States
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Messages
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // User data - only editable fields: name, phone, company
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    joinedDate: "",
  })

  // Original data for cancel
  const [originalData, setOriginalData] = useState(userData)

  // Password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid || !db) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          const fetchedData = {
            name: data.name || user.displayName || "User",
            email: user.email || "",
            phone: data.phone || "",
            company: data.company || "",
            joinedDate:
              data.createdAt?.toDate?.()?.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              }) || "Recently joined",
          }
          setUserData(fetchedData)
          setOriginalData(fetchedData)
        } else {
          // Create user document if doesn't exist
          const newUserData = {
            name: user.displayName || "User",
            email: user.email || "",
            phone: "",
            company: "",
            createdAt: new Date(),
          }
          await setDoc(doc(db, "users", user.uid), newUserData)
          setUserData({
            ...newUserData,
            joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          })
          setOriginalData({
            ...newUserData,
            joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setErrorMessage("Failed to load profile data")
      }
    }

    fetchUserData()
  }, [user])

  const handleSave = async () => {
    if (!user?.uid || !db) return

    // Validation
    if (!userData.name.trim()) {
      setErrorMessage("Name is required")
      return
    }

    setIsSaving(true)
    setErrorMessage("")

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: userData.name,
        phone: userData.phone,
        company: userData.company,
        updatedAt: new Date(),
      })

      setOriginalData(userData)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error saving:", error)
      setErrorMessage("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setUserData(originalData)
    setIsEditing(false)
    setErrorMessage("")
  }

  const handlePasswordChange = async () => {
    if (!user) return

    // Validation
    if (!passwordData.currentPassword) {
      setErrorMessage("Current password is required")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords do not match")
      return
    }

    setIsChangingPassword(true)
    setErrorMessage("")

    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(user.email!, passwordData.currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, passwordData.newPassword)

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setSuccessMessage("Password updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      console.error("Error changing password:", error)
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Current password is incorrect")
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("New password is too weak")
      } else {
        setErrorMessage("Failed to update password. Please try again.")
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <ProtectedRoute>
      <AnimatedBackground />
      <DashboardNav userRole="client" />

      <div className="min-h-screen pt-24 pb-12" style={{ backgroundColor: "#050505" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
              My Profile
            </h1>
            <p className="text-lg" style={{ color: "#9CA3AF" }}>
              Manage your account settings
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-6 animate-in slide-in-from-top"
              style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span style={{ color: "#10B981" }}>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-6 animate-in slide-in-from-top"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span style={{ color: "#EF4444" }}>{errorMessage}</span>
              <button onClick={() => setErrorMessage("")} className="ml-auto hover:opacity-70">
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}

          {/* Profile Header Card - Simplified without photo upload */}
          <Card
            className="mb-6 rounded-3xl overflow-hidden"
            style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(250,204,21,0.15)" }}
          >
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar - Display only, no upload */}
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)",
                    color: "#000000",
                    border: "4px solid rgba(250,204,21,0.3)",
                  }}
                >
                  {userData.name.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl font-bold mb-1" style={{ color: "#FFFFFF" }}>
                    {userData.name}
                  </h2>
                  <p className="text-lg mb-3" style={{ color: "#9CA3AF" }}>
                    {userData.email}
                  </p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar size={16} style={{ color: "#FACC15" }} />
                    <span className="text-sm" style={{ color: "#9CA3AF" }}>
                      Joined {userData.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card
            className="mb-6 rounded-3xl"
            style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(250,204,21,0.15)" }}
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2" style={{ color: "#FFFFFF" }}>
                    <User size={20} style={{ color: "#FACC15" }} />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="mt-1" style={{ color: "#9CA3AF" }}>
                    Update your personal details
                  </CardDescription>
                </div>

                {/* Edit/Save/Cancel Buttons */}
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl px-5 py-2.5 font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #FACC15",
                      color: "#FACC15",
                    }}
                  >
                    <Pencil size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCancel}
                      className="rounded-xl px-5 py-2.5 font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#9CA3AF",
                      }}
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-xl px-5 py-2.5 font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: "#FACC15",
                        color: "#000000",
                        boxShadow: "0 0 20px rgba(250,204,21,0.3)",
                      }}
                    >
                      {isSaving ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Check size={16} className="mr-2" />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <Label
                    htmlFor="name"
                    className="flex items-center gap-2 mb-2 text-sm font-medium"
                    style={{ color: "#FFFFFF" }}
                  >
                    <User size={14} style={{ color: "#FACC15" }} />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    disabled={!isEditing}
                    className="rounded-xl h-12 transition-all duration-300"
                    style={{
                      backgroundColor: isEditing ? "#0A0A0A" : "#050505",
                      border: isEditing ? "1px solid rgba(250,204,21,0.3)" : "1px solid rgba(255,255,255,0.1)",
                      color: "#FFFFFF",
                    }}
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 mb-2 text-sm font-medium"
                    style={{ color: "#FFFFFF" }}
                  >
                    <Mail size={14} style={{ color: "#FACC15" }} />
                    Email Address
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
                    >
                      Cannot change
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    disabled
                    className="rounded-xl h-12"
                    style={{
                      backgroundColor: "#050505",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#6B7280",
                      opacity: 0.7,
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-2 mb-2 text-sm font-medium"
                    style={{ color: "#FFFFFF" }}
                  >
                    <Phone size={14} style={{ color: "#FACC15" }} />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+91 98765 43210"
                    className="rounded-xl h-12 transition-all duration-300"
                    style={{
                      backgroundColor: isEditing ? "#0A0A0A" : "#050505",
                      border: isEditing ? "1px solid rgba(250,204,21,0.3)" : "1px solid rgba(255,255,255,0.1)",
                      color: "#FFFFFF",
                    }}
                  />
                </div>

                {/* Company */}
                <div>
                  <Label
                    htmlFor="company"
                    className="flex items-center gap-2 mb-2 text-sm font-medium"
                    style={{ color: "#FFFFFF" }}
                  >
                    <Building size={14} style={{ color: "#FACC15" }} />
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    value={userData.company}
                    onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Your company name"
                    className="rounded-xl h-12 transition-all duration-300"
                    style={{
                      backgroundColor: isEditing ? "#0A0A0A" : "#050505",
                      border: isEditing ? "1px solid rgba(250,204,21,0.3)" : "1px solid rgba(255,255,255,0.1)",
                      color: "#FFFFFF",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card
            className="rounded-3xl"
            style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(250,204,21,0.15)" }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2" style={{ color: "#FFFFFF" }}>
                <Shield size={20} style={{ color: "#FACC15" }} />
                Change Password
              </CardTitle>
              <CardDescription style={{ color: "#9CA3AF" }}>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Current Password */}
              <div>
                <Label
                  htmlFor="currentPassword"
                  className="flex items-center gap-2 mb-2 text-sm font-medium"
                  style={{ color: "#FFFFFF" }}
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="rounded-xl h-12 pr-12"
                    style={{
                      backgroundColor: "#0A0A0A",
                      border: "1px solid rgba(250,204,21,0.3)",
                      color: "#FFFFFF",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: "#9CA3AF" }}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* New Password */}
                <div>
                  <Label
                    htmlFor="newPassword"
                    className="flex items-center gap-2 mb-2 text-sm font-medium"
                    style={{ color: "#FFFFFF" }}
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="rounded-xl h-12 pr-12"
                      style={{
                        backgroundColor: "#0A0A0A",
                        border: "1px solid rgba(250,204,21,0.3)",
                        color: "#FFFFFF",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "#9CA3AF" }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center gap-2 mb-2 text-sm font-medium"
                    style={{ color: "#FFFFFF" }}
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="rounded-xl h-12 pr-12"
                      style={{
                        backgroundColor: "#0A0A0A",
                        border: "1px solid rgba(250,204,21,0.3)",
                        color: "#FFFFFF",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "#9CA3AF" }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "#FACC15",
                  color: "#000000",
                  boxShadow: "0 0 20px rgba(250,204,21,0.3)",
                }}
              >
                {isChangingPassword ? (
                  <Loader2 size={18} className="mr-2 animate-spin" />
                ) : (
                  <Shield size={18} className="mr-2" />
                )}
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
