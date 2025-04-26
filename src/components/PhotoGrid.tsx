import React, { useState } from 'react';
import { Photo } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import usePhotoStore from '@/lib/store';

interface PhotoGridProps {
  albumId: string;
  photos: Photo[];
  viewMode: 'grid' | 'masonry' | 'list';
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ albumId, photos, viewMode }) => {
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
        <p className="text-sm mt-2">Загрузите фотографии, используя форму выше</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
            <div className="flex">
              <div className="w-32 h-24 flex-shrink-0">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
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
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium">{photo.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(photo.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => startEditing(photo)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => deletePhoto(albumId, photo.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
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
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
        {photos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid group relative">
            <img src={photo.url} alt={photo.title} className="w-full rounded-md" />
            <div className="p-2">
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
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium truncate">{photo.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => startEditing(photo)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => deletePhoto(albumId, photo.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default grid layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden group">
          <div className="h-32 sm:h-40">
            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
          </div>
          <CardContent className="p-2">
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
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium truncate">{photo.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => startEditing(photo)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => deletePhoto(albumId, photo.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PhotoGrid;
