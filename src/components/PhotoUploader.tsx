import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import usePhotoStore from "@/lib/store";

interface PhotoUploaderProps {
  albumId: string;
}

const PhotoUploader = ({ albumId }: PhotoUploaderProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addPhotoToAlbum } = usePhotoStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    for (const file of files) {
      try {
        // In a real app, you would upload to a server here
        // For now, we'll use a local URL
        const url = URL.createObjectURL(file);
        const title = file.name.split('.')[0]; // Use filename as title
        
        addPhotoToAlbum(albumId, {
          url,
          title
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    
    setFiles([]);
  };

  return (
    <div className="mt-4 p-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium">
          Перетащите фото сюда или нажмите для выбора
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Поддерживаются JPG, PNG, GIF
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          className="mt-4"
        >
          Выбрать файлы
        </Button>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Выбрано файлов: {files.length}</h4>
            <Button onClick={uploadFiles} size="sm">
              Загрузить все
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X size={14} />
                </button>
                <p className="text-xs truncate mt-1">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
