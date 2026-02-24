import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"

export interface UploadProgress {
  progress: number
  error?: string
  downloadURL?: string
}

export async function uploadFile(file: File, path: string, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!storage) return reject(new Error("[Firebase] Storage service is not available"))
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) {
          onProgress(progress)
        }
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      },
    )
  })
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    if (!storage) throw new Error("[Firebase] Storage service is not available")
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
  } catch (error) {
    throw error
  }
}
