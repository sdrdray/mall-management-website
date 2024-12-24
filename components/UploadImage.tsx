'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadImageProps {
  onUpload: (file: File) => void;
}

export function UploadImage({ onUpload }: UploadImageProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    onUpload(file)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} })

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag 'n' drop an image here, or click to select one</p>
      )}
    </div>
  )
}

