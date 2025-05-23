import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import PhotoGrid from '@/components/PhotoGrid';
import { Button } from '@/components/ui/button';
import { Grid, Columns, List, Trash2, Upload } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import usePhotoStore from '@/lib/store';

const AlbumPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, viewMode, setViewMode, deleteAllPhotos, addPhotoToAlbum } = usePhotoStore();
  const [photosPerRow, setPhotosPerRow] = useState<number>(4); // Default photos per row
  const [gapSize, setGapSize] = useState<number>(2); // Default gap size
  
  const album = albums.find(a => a.id === albumId);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPhotosPerRow = localStorage.getItem('photos-per-row');
    const savedGapSize = localStorage.getItem('photo-gap-size');
    
    if (savedPhotosPerRow) setPhotosPerRow(Number(savedPhotosPerRow));
    if (savedGapSize) setGapSize(Number(savedGapSize));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('photos-per-row', photosPerRow.toString());
    localStorage.setItem('photo-gap-size', gapSize.toString());
  }, [photosPerRow, gapSize]);
  
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

  const handleUploadButtonClick = () => {
    const uploadInput = document.getElementById('photo-upload-input');
    if (uploadInput) {
      uploadInput.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header albumTitle={album.title} />
      <main className="flex-1 container mx-auto p-4 relative">
        <div className="bg-white pb-4 border-b mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{album.title}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Вы уверены, что хотите удалить все фотографии?')) {
                    deleteAllPhotos(album.id);
                  }
                }}
                className="flex items-center gap-2"
                disabled={album.photos.length === 0}
              >
                <Trash2 size={16} /> Удалить все фото
              </Button>
              <Button
                onClick={handleUploadButtonClick}
                className="flex items-center gap-2"
              >
                <Upload size={16} /> Добавить фото
              </Button>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
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
          </div>
          
          {/* Скрытый input для загрузки файлов */}
          <input
            type="file"
            id="photo-upload-input"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target && typeof event.target.result === 'string') {
                      addPhotoToAlbum(
                        album.id,
                        {
                          title: file.name.split('.')[0] || 'Без названия',
                          url: event.target.result
                        }
                      );
                    }
                  };
                  reader.readAsDataURL(file);
                }
                e.target.value = '';
              }
            }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
            <div>
              <label className="text-sm font-medium flex justify-between mb-2">
                <span>Количество фото в строке</span>
                <span className="text-muted-foreground">{photosPerRow}</span>
              </label>
              <Slider 
                value={[photosPerRow]} 
                min={3} 
                max={8} 
                step={1} 
                onValueChange={(value) => setPhotosPerRow(value[0])}
              />
            </div>
            <div>
              <label className="text-sm font-medium flex justify-between mb-2">
                <span>Отступы между фото</span>
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
          
          <p className="text-sm text-gray-500">
            {album.photos.length} фото в альбоме
          </p>
        </div>

        <div className="pt-4">
          <PhotoGrid 
            albumId={album.id} 
            photos={album.photos} 
            viewMode={viewMode}
            photosPerRow={photosPerRow}
            gapSize={gapSize}
          />
        </div>
      </main>
    </div>
  );
};

export default AlbumPage;