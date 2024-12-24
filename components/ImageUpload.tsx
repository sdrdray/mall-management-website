'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  folder: string;
}

export function ImageUpload({ onImageUpload, currentImageUrl, folder }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl)
    }
  }, [currentImageUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const storageRef = ref(storage, `${folder}/${Date.now()}_${selectedFile.name}`)
    const uploadTask = uploadBytesResumable(storageRef, selectedFile)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(progress)
      },
      (error) => {
        console.error('Upload failed:', error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        onImageUpload(downloadURL)
        setUploadProgress(0)
      }
    )
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    onImageUpload('')
  }

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div>
          <img src={previewUrl} alt="Preview" className="max-w-xs rounded-lg shadow-md" />
          <Button onClick={handleRemoveImage} className="mt-2">Remove Image</Button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button as="span">Select Image</Button>
          </label>
        </div>
      )}
      {selectedFile && (
        <div>
          <Button onClick={handleUpload} disabled={uploadProgress > 0 && uploadProgress < 100}>
            {uploadProgress > 0 ? `Uploading: ${Math.round(uploadProgress)}%` : 'Upload Image'}
          </Button>
        </div>
      )}
    </div>
  )
}

