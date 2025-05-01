import React, { useState } from 'react';
import { Photo } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import usePhotoStore from '@/lib/store';

interface PhotoGridProps {
  albumId: string;
  photos: Photo[];
  viewMode: 'grid' | 'masonry' | 'list';
  photosPerRow: number; // Photos per row (3-8)
  gapSize: number; // Gap between photos
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ albumId, photos, viewMode, photosPerRow, gapSize }) => {
  const { deletePhoto, updatePhotoTitle } = usePhotoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startEditing = (photo: Photo) => {
    setEditingId(photo.id);
    setEditingTitle(photo.title);
  };

  const saveTitle = (photoId: string) => {
    updatePhotoTitle(albumId, photoId, editingTitle);
    setEditingId(null);
  };

  // Форматируем дату
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (photos.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        <p>В этом альбоме пока нет фотографий</p>
        <p className="text-sm mt-2">Загрузите фотографии, используя кнопку "Добавить фото"</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2" style={{ gap: `${gapSize}px` }}>
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group relative">
            <div className="flex">
              <div 
                className="w-32 flex-shrink-0 relative"
                style={{ height: '80px' }}
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                
                {/* Иконка удаления в верхнем правом углу */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-1 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:text-white hover:bg-black/60"
                    onClick={() => {
                      if (window.confirm(`Удалить фото "${photo.title}"?`)) {
                        deletePhoto(albumId, photo.id);
                      }
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3 flex-1 flex flex-col justify-between">
                {editingId === photo.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 p-1 border rounded text-sm"
                      autoFocus
                      onBlur={() => saveTitle(photo.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveTitle(photo.id)}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium cursor-pointer" onClick={() => startEditing(photo)}>{photo.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(photo.createdAt)}
                    </p>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Masonry layout
  if (viewMode === 'masonry') {
    // Calculate columns based on photosPerRow
    const columnCount = Math.min(photosPerRow, 6); // Cap at 6 for masonry
    
    return (
      <div 
        className="columns-1 sm:columns-2"
        style={{ 
          columnCount: columnCount, 
          columnGap: `${gapSize}px` 
        }}
      >
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="break-inside-avoid group relative mb-1"
            style={{ marginBottom: `${gapSize}px` }}
          >
            <div className="relative">
              <div style={{ paddingBottom: '150%' }}> {/* 2:3 ratio */}
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="absolute inset-0 w-full h-full object-cover rounded-md" 
                />
              </div>
              
              {/* Иконка удаления в верхнем правом углу */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-1 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-white hover:bg-black/60"
                  onClick={() => {
                    if (window.confirm(`Удалить фото "${photo.title}"?`)) {
                      deletePhoto(albumId, photo.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            
            <div className="p-2 cursor-pointer" onClick={() => startEditing(photo)}>
              {editingId === photo.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 p-1 border rounded text-sm"
                    autoFocus
                    onBlur={() => saveTitle(photo.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveTitle(photo.id)}
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium truncate">{photo.title}</h3>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default grid layout with custom photos per row
  return (
    <div 
      className="grid"
      style={{ 
        gridTemplateColumns: `repeat(${photosPerRow}, 1fr)`,
        gap: `${gapSize}px` 
      }}
    >
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden group relative">
          <div style={{ width: '100%' }}>
            <div className="relative" style={{ paddingBottom: '150%' }}> {/* 2:3 ratio */}
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              
              {/* Иконка удаления в верхнем правом углу */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-1 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-white hover:bg-black/60"
                  onClick={() => {
                    if (window.confirm(`Удалить фото "${photo.title}"?`)) {
                      deletePhoto(albumId, photo.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-2 cursor-pointer" onClick={() => startEditing(photo)}>
            {editingId === photo.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 p-1 border rounded text-sm"
                  autoFocus
                  onBlur={() => saveTitle(photo.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveTitle(photo.id)}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium truncate">{photo.title}</h3>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PhotoGrid;