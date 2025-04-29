import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Album } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import usePhotoStore from '@/lib/store';

const AlbumGrid: React.FC = () => {
  const { albums, createAlbum, deleteAlbum, updateAlbumTitle, deleteAllAlbums } = usePhotoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [albumSize, setAlbumSize] = useState<number>(40); // Default height in percentage
  const [gapSize, setGapSize] = useState<number>(2); // Default gap size

  // Load preferences from localStorage
  useEffect(() => {
    const savedAlbumSize = localStorage.getItem('album-size');
    const savedGapSize = localStorage.getItem('album-gap-size');
    
    if (savedAlbumSize) setAlbumSize(Number(savedAlbumSize));
    if (savedGapSize) setGapSize(Number(savedGapSize));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('album-size', albumSize.toString());
    localStorage.setItem('album-gap-size', gapSize.toString());
  }, [albumSize, gapSize]);

  const handleCreateAlbum = () => {
    createAlbum();
  };

  const startEditing = (album: Album) => {
    setEditingId(album.id);
    setEditingTitle(album.title);
  };

  const saveTitle = (id: string) => {
    updateAlbumTitle(id, editingTitle);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-4 relative">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm mb-6 pt-2 pb-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Мои альбомы</h2>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (window.confirm('Вы уверены, что хотите удалить все альбомы?')) {
                  deleteAllAlbums();
                }
              }}
              className="flex items-center gap-2"
              disabled={albums.length === 0}
            >
              <Trash2 size={16} /> Удалить все
            </Button>
            <Button onClick={handleCreateAlbum} className="flex items-center gap-2">
              <Plus size={16} /> Добавить альбом
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium flex justify-between mb-2">
              <span>Размер альбомов</span>
              <span className="text-muted-foreground">{albumSize}%</span>
            </label>
            <Slider 
              value={[albumSize]} 
              min={20} 
              max={80} 
              step={5} 
              onValueChange={(value) => setAlbumSize(value[0])}
            />
          </div>
          <div>
            <label className="text-sm font-medium flex justify-between mb-2">
              <span>Отступы между альбомами</span>
              <span className="text-muted-foreground">{gapSize}px</span>
            </label>
            <Slider 
              value={[gapSize]} 
              min={0} 
              max={16} 
              step={1} 
              onValueChange={(value) => setGapSize(value[0])}
            />
          </div>
        </div>
      </div>

      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        style={{ gap: `${gapSize}px` }}
      >
        {albums.map((album) => (
          <Card 
            key={album.id} 
            className="overflow-hidden group relative hover:shadow-md transition-shadow"
          >
            {/* Иконка удаления в верхнем правом углу */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:text-white hover:bg-black/60" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (window.confirm(`Удалить альбом "${album.title}"?`)) {
                    deleteAlbum(album.id);
                  }
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            <Link to={`/album/${album.id}`}>
              <div 
                className="relative bg-gray-100 flex items-center justify-center"
                style={{ paddingBottom: `${albumSize * 1.5}%` }} // 2:3 ratio based on width
              >
                {album.coverUrl ? (
                  <img 
                    src={album.coverUrl} 
                    alt={album.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Нет фото</div>
                )}
              </div>
            </Link>

            <CardContent className="p-3">
              {editingId === album.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 p-1 border rounded text-sm"
                    autoFocus
                    onBlur={() => saveTitle(album.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveTitle(album.id)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium truncate">{album.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {album.photos.length} фото
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      startEditing(album);
                    }}
                  >
                    <Edit2 size={14} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Фиксированная кнопка создания альбома */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button onClick={handleCreateAlbum} className="rounded-full h-14 w-14 shadow-lg">
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
};

export default AlbumGrid;
