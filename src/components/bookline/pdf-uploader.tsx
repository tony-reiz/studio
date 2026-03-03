'use client';

import { useState, useRef, useEffect } from 'react';
import { CloudUpload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PdfUploaderProps {
  pdfFile: File | null;
  onFileChange: (file: File | null) => void;
  className?: string;
  originalSize?: number | null;
  compressedSize?: number | null;
  isCompressing?: boolean;
}

export function PdfUploader({ pdfFile, onFileChange, className, originalSize, compressedSize, isCompressing }: PdfUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileChange(file);
    } else {
      onFileChange(null);
    }
  };

  useEffect(() => {
    let url: string | null = null;
    if (pdfFile) {
      url = URL.createObjectURL(pdfFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [pdfFile]);

  useEffect(() => {
    if (previewUrl) {
      const timer = setTimeout(() => {
        setIsPdfVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsPdfVisible(false);
    }
  }, [previewUrl]);


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const formatBytes = (bytes: number | null | undefined, decimals = 2) => {
    if (!bytes) return '0 Mo';
    if (bytes === 0) return '0 Mo';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'Ko', 'Mo', 'Go', 'To'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div
      className={cn("w-full max-w-[18rem] md:w-80 cursor-pointer group rounded-[25px] shadow-lg", className)}
      onClick={handleUploadClick}
    >
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />
      <div
        className={cn(
          'aspect-[210/297] p-0 flex items-center justify-center rounded-[25px] overflow-hidden relative bg-[#DFDFDF] transition-colors',
          {'group-hover:bg-[#d0d0d0]': !pdfFile}
        )}
      >
        {originalSize && (
            <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-[10px] font-semibold rounded-full px-2.5 py-1 backdrop-blur-sm flex items-center gap-1.5">
                <span>{formatBytes(originalSize)}</span>
                
                {isCompressing && (
                    <>
                        <span>=</span>
                        <Loader2 className="h-3 w-3 animate-spin" />
                    </>
                )}

                {compressedSize && !isCompressing && (
                    <div className="flex items-center gap-1.5 animate-in fade-in-0 slide-in-from-left-4 duration-700">
                        <span>=</span>
                        <span className='text-green-400'>{formatBytes(compressedSize)}</span>
                    </div>
                )}
            </div>
        )}
        {previewUrl ? (
          <object 
            data={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
            type="application/pdf" 
            className={cn(
              "absolute inset-0 w-full h-full border-0 pointer-events-none scale-110 transition-opacity duration-500 ease-in-out",
              isPdfVisible ? "opacity-100" : "opacity-0"
            )} 
            title="Aperçu du PDF" 
          />
        ) : (
          <CloudUpload className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
