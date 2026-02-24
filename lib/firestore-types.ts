export interface UserDocument {
  email: string
  displayName: string
  role: "client" | "admin"
  createdAt: string
  updatedAt?: string
}

export interface OrderDocument {
  userId: string
  userName: string
  userEmail: string
  userWhatsapp: string
  serviceType: string
  description: string
  deadline: string
  budget?: string
  status: "pending" | "working" | "delivered" | "cancelled"
  price?: string
  createdAt: string
  updatedAt?: string
  deliveredAt?: string
  fileUrls?: string[]
  downloadUrls?: string[]
  statusHistory?: StatusHistoryEntry[]
}

export interface StatusHistoryEntry {
  status: "pending" | "working" | "delivered" | "cancelled"
  timestamp: string
  updatedBy?: string
  updatedByName?: string
  note?: string
}

export interface MessageDocument {
  orderId: string
  senderId: string
  senderName: string
  senderRole: "client" | "admin"
  message: string
  fileUrl?: string
  fileName?: string
  createdAt: string
  read: boolean
}

export interface FileDocument {
  orderId: string
  userId: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  uploadedBy: "client" | "admin"
  createdAt: string
}

export interface SupportChatDocument {
  sessionId: string
  userId?: string
  userName?: string
  userEmail?: string
  messages: {
    role: "user" | "assistant"
    content: string
    timestamp: string
  }[]
  createdAt: string
  updatedAt: string
  status: "active" | "resolved"
}

export interface ReviewDocument {
  orderId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  review: string
  serviceType: string
  createdAt: string
}

export interface NotificationDocument {
  userId: string
  type: "order_update" | "message" | "delivery" | "review"
  title: string
  message: string
  read: boolean
  createdAt: string
  orderId?: string
}
