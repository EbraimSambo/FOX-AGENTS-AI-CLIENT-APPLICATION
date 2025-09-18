import { X, Upload, FileText, Image as ImageIcon, Video, Music } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

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

const ShowFilesSelected = ({ fileInputRef, form }: DropFilesProps) => {
  const watchedFiles = form.watch('files')
  const files = React.useMemo(() => watchedFiles || [], [watchedFiles])
  const [isDragging, setIsDragging] = React.useState(false)

  // Detectar drag em toda a tela
  React.useEffect(() => {
    let dragCounter = 0

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter++
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter--
      if (dragCounter === 0) {
        setIsDragging(false)
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      dragCounter = 0
      setIsDragging(false)
    }

    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragenter', handleDragEnter)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('drop', handleDrop)
    }
  }, [])

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFiles = form.getValues('files') || []
      form.setValue('files', [...currentFiles, ...acceptedFiles])
    }
    setIsDragging(false)
  }, [form])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true,
    noClick: false,
    noKeyboard: true
  })

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

  const getFileIcon = (file: File) => {
    const fileType = file.type

    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />
    } else if (fileType.startsWith('video/')) {
      return <Video className="w-8 h-8 text-red-500" />
    } else if (fileType.startsWith('audio/')) {
      return <Music className="w-8 h-8 text-green-500" />
    } else {
      return <FileText className="w-8 h-8 text-yellow-500" />
    }
  }

  const createFilePreview = (file: File): string | null => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return null
  }

  return (
    <div className="w-full text-white">
      {/* Área de Drop - sempre ativa mas só mostra estilo quando arrastando */}
      <div
        {...getRootProps()}
        className={`
          transition-all
          ${isDragging 
            ? 'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
            : 'min-h-[1px]'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {isDragging && (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Solte os arquivos aqui...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ou clique para selecionar arquivos
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Suporta: Imagens, Vídeos, Áudios e Documentos
            </p>
          </div>
        )}
      </div>

      {/* Input oculto para seleção manual */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={handleFileSelect}
      />

      {/* Imagens selecionadas */}
      {files.length > 0 && (
        <div className={isDragging ? "mt-0" : ""}>
          <h3 className="text-sm font-medium  mb-3">
            Arquivos selecionados ({files.length})
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            {files.map((file, index) => {
              const isImage = file.type.startsWith('image/')
              const preview = createFilePreview(file)
              
              return (
                <div className="relative h-20 w-20" key={index}>
                  <button
                    onClick={() => removeFile(index)}
                    className="flex items-center justify-center h-6 w-6 hover:bg-red-600 rounded-full z-10 transition-colors absolute -top-2 -right-2 bg-red-500 text-white"
                    title={`Remover ${file.name}`}
                  >
                    <X className="size-3" />
                  </button>
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    {isImage && preview ? (
                      <Image
                        alt={file.name}
                        src={preview}
                        className="object-cover"
                        fill
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                        {getFileIcon(file)}
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate w-full px-1 text-center">
                          {file.name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShowFilesSelected