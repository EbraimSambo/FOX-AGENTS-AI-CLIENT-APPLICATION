import Image from 'next/image';
import React from 'react';
import { 
  FileText, 
  File, 
  FileVideo, 
  FileAudio, 
  Archive,
  Download
} from 'lucide-react';

interface Props {
  attachments: {
    url: string;
    name?: string; // Nome do arquivo (opcional)
  }[]
}

const Attachments = ({ attachments }: Props) => {
  // Função para determinar o tipo de arquivo
  const getFileType = (url: string, name?: string) => {
    const fileName = name || url;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Extensões de imagem
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    // Extensões de vídeo
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    // Extensões de áudio
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
    // Extensões de documento
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    // Extensões de arquivo comprimido
    const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
    
    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    if (audioExtensions.includes(extension)) return 'audio';
    if (documentExtensions.includes(extension)) return 'document';
    if (archiveExtensions.includes(extension)) return 'archive';
    
    return 'file';
  };

  // Função para obter o ícone apropriado
  const getFileIcon = (type: string) => {
    const iconProps = { size: 24, className: "text-gray-600" };
    
    switch (type) {
      case 'video':
        return <FileVideo {...iconProps} />;
      case 'audio':
        return <FileAudio {...iconProps} />;
      case 'document':
        return <FileText {...iconProps} />;
      case 'archive':
        return <Archive {...iconProps} />;
      default:
        return <File {...iconProps} />;
    }
  };

  // Função para extrair o nome do arquivo da URL
  const getFileName = (url: string, name?: string) => {
    if (name) return name;
    return url.split('/').pop()?.split('?')[0] || 'Arquivo';
  };

  const handleFileClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center justify-end w-full gap-4 flex-wrap mt-2">
      {attachments.map((attachment, index) => {
        const fileType = getFileType(attachment.url, attachment.name);
        const fileName = getFileName(attachment.url, attachment.name);
        
        if (fileType === 'image') {
          // Renderizar imagem como antes
          return (
            <div 
              className="relative w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity" 
              key={attachment.url + index}
              onClick={() => handleFileClick(attachment.url)}
            >
              <Image
                priority
                alt={fileName}
                src={attachment.url}
                className='rounded-2xl object-cover'
                fill
              />
            </div>
          );
        } else {
          // Renderizar outros tipos de arquivo com ícone
          return (
            <div 
              className="w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded-2xl cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200" 
              key={attachment.url + index}
              onClick={() => handleFileClick(attachment.url)}
              title={fileName}
            >
              <div className="mb-1">
                {getFileIcon(fileType)}
              </div>
              <div className="text-xs text-gray-600 text-center truncate w-full px-1">
                {fileName.length > 8 ? fileName.substring(0, 8) + '...' : fileName}
              </div>
              <Download size={12} className="text-gray-400 mt-1" />
            </div>
          );
        }
      })}
    </div>
  );
};

export default Attachments;