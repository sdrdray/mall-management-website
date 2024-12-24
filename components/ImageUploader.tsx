'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  folder: string;
}

export function ImageUploader({ onImageUpload, folder }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    const storageRef = ref(storage, `${folder}/${Date.now()}_${selectedFile.name}`)
    const uploadTask = uploadBytesResumable(storageRef, selectedFile)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(progress)
      },
      (error) => {
        console.error('Upload failed:', error)
        setUploading(false)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        onImageUpload(downloadURL)
        setUploading(false)
        setUploadProgress(0)
        setSelectedFile(null)
      }
    )
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {selectedFile && (
        <div>
          <p>Selected file: {selectedFile.name}</p>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? `Uploading: ${Math.round(uploadProgress)}%` : 'Upload Image'}
          </Button>
        </div>
      )}
    </div>
  )
}

