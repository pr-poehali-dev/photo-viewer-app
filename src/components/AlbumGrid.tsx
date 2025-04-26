import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Album } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import usePhotoStore from '@/lib/store';

const AlbumGrid: React.FC = () => {
  const { albums, createAlbum, deleteAlbum, updateAlbumTitle } = usePhotoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

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
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Мои альбомы</h2>
        <Button onClick={handleCreateAlbum} className="flex items-center gap-2">
          <Plus size={16} /> Создать альбом
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {albums.map((album) => (
          <Card key={album.id} className="overflow-hidden group relative hover:shadow-md transition-shadow">
            <Link to={`/album/${album.id}`}>
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {album.coverUrl ? (
                  <img 
                    src={album.coverUrl} 
                    alt={album.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">Нет фото</div>
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
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium truncate">{album.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startEditing(album);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-red-500" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteAlbum(album.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {album.photos.length} фото
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlbumGrid;
