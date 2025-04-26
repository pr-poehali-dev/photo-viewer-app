import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import usePhotoStore from '@/lib/store';

interface PhotoUploaderProps {
  albumId: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ albumId }) => {
  const { addPhotoToAlbum } = usePhotoStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: FileList) => {
    if (files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            
            // Create an object URL for the image
            const imageUrl = URL.createObjectURL(file);
            
            // Add the photo to the album
            addPhotoToAlbum(albumId, {
              url: imageUrl,
              title: file.name
            });
          }, 500);
        }
      }, 50);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      <div className="text-center">
        {uploadProgress !== null ? (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">Загрузка... {uploadProgress}%</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={() => setUploadProgress(null)}
            >
              <X size={16} className="mr-1" /> Отменить
            </Button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium">Перетащите фотографии сюда</h3>
            <p className="mt-1 text-xs text-gray-500">или</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={triggerFileInput}
            >
              Выбрать файлы
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              Поддерживаются JPG, PNG, GIF
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoUploader;
