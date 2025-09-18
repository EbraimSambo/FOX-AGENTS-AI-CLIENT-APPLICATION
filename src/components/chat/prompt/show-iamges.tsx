import { X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

interface DropFilesProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  form: UseFormReturn<{
    prompt?: string | undefined;
    model?: string | undefined;
    files?: File[] | undefined;
}, any, {
    prompt?: string | undefined;
    model?: string | undefined;
    files?: File[] | undefined;
}>
}

const ShowImagesSelected = ({ fileInputRef, form }: DropFilesProps) => {
  const watchedFiles = form.watch('files')
  const files = React.useMemo(() => watchedFiles || [], [watchedFiles])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles)
      const currentFiles = form.getValues('files') || []
      form.setValue('files', [...currentFiles, ...fileArray])
    }
  }

  const removeFile = (indexToRemove: number) => {
    const currentFiles = form.getValues('files') || []
    const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove)
    form.setValue('files', updatedFiles)
  }

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  return (
    <div className='flex items-center gap-4 flex-wrap text-white w-full'>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
      />
      {files.map((file, index) => (
        <div className="relative h-20 w-20" key={index}>
          <button
            onClick={() => removeFile(index)}
            className="flex items-center justify-center h-8 w-8 hover:bg-muted-foreground/20 rounded-md z-10 transition-colors absolute -top-2 -right-2 bg-black/50"
          >
            <X className="size-4" />
          </button>
          <div className="relative w-full h-full">
            <Image 
              alt={file.name} 
              src={createImagePreview(file)} 
              className='rounded-2xl object-cover' 
              fill 
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShowImagesSelected