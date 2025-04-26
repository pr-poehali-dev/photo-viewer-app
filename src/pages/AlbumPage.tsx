import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import PhotoGrid from '@/components/PhotoGrid';
import PhotoUploader from '@/components/PhotoUploader';
import { Button } from '@/components/ui/button';
import { Grid, Columns, List } from 'lucide-react';
import usePhotoStore from '@/lib/store';

const AlbumPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, viewMode, setViewMode } = usePhotoStore();
  
  const album = albums.find(a => a.id === albumId);
  
  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Альбом не найден</h2>
          <p className="text-gray-600 mb-6">
            Возможно, альбом был удален или у вас неверная ссылка.
          </p>
          <Button asChild>
            <a href="/">Вернуться на главную</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header albumTitle={album.title} />
      <main className="flex-1 container mx-auto p-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{album.title}</h1>
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'masonry' ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('masonry')}
              >
                <Columns size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
          
          <PhotoUploader albumId={album.id} />
          
          <p className="text-sm text-gray-500 mb-4">
            {album.photos.length} фото в альбоме
          </p>
        </div>

        <PhotoGrid 
          albumId={album.id} 
          photos={album.photos} 
          viewMode={viewMode}
        />
      </main>
    </div>
  );
};

export default AlbumPage;
