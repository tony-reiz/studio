'use client';

import { useState, useCallback, useEffect } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ImageCropperProps {
  imageSrc: string | null;
  onCropComplete: (croppedImageUrl: string) => void;
  onClose: () => void;
}

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
    const image = new Image();
    image.src = imageSrc;
    const p = new Promise(resolve => {
        image.onload = resolve;
    });
    await p;

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/png');
}


export function ImageCropper({ imageSrc, onCropComplete, onClose }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  
  useEffect(() => {
    let contentTimer: NodeJS.Timeout;
    if (imageSrc) {
      setIsContentVisible(false);
      contentTimer = setTimeout(() => {
        setIsContentVisible(true);
      }, 700);
    }
    return () => {
      clearTimeout(contentTimer);
    };
  }, [imageSrc]);

  const onCropChange = useCallback((location: {x:number, y:number}) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete, onClose]);

  if (!imageSrc) {
    return null;
  }

  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-0">
        <div className={cn("transition-opacity duration-300", isContentVisible ? "opacity-100" : "opacity-0")}>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Recadrer l'image</DialogTitle>
            </DialogHeader>
            <div className="relative w-full aspect-square">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={handleCropComplete}
                cropShape="round"
                showGrid={false}
              />
            </div>
            <div className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                    <label htmlFor="zoom" className="text-sm font-medium">Zoom</label>
                    <Slider
                        id="zoom"
                        min={1}
                        max={3}
                        step={0.1}
                        value={[zoom]}
                        onValueChange={(value) => onZoomChange(value[0])}
                    />
                </div>
                 <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button onClick={showCroppedImage}>Recadrer</Button>
                </DialogFooter>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
