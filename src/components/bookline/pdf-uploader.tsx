'use client';

import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PdfUploaderProps {
  pdfFile: File | null;
  onFileChange: (file: File | null) => void;
  className?: string;
}

export function PdfUploader({ pdfFile, onFileChange, className }: PdfUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn("w-full max-w-xs cursor-pointer group rounded-[25px] shadow-lg", className)}
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
        {previewUrl ? (
          <object data={`${previewUrl}#view=Fit&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="absolute inset-0 w-full h-full border-0 pointer-events-none" title="Aperçu du PDF" />
        ) : (
          <Download className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
