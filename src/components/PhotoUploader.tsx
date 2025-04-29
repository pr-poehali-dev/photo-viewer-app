import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import usePhotoStore from '@/lib/store';

interface PhotoUploaderProps {
  albumId: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ albumId }) => {
  const { addPhotoToAlbum } = usePhotoStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadFiles(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      uploadFiles(Array.from(files));
    }
  };

  const uploadFiles = (files: File[]) => {
    // Фильтруем только изображения
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        addPhotoToAlbum(albumId, {
          title: file.name.split('.')[0], // Имя файла без расширения
          url: imageUrl
        });
      };
      
      reader.readAsDataURL(file);
    }

    // Сбрасываем input после загрузки
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center py-2">
        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 mb-2">
          Перетащите фотографии сюда или нажмите, чтобы выбрать
        </p>
        <input
          id="photo-upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm"
        >
          Выбрать фотографии
        </button>
      </div>
    </div>
  );
};

export default PhotoUploader;
