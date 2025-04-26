import { Album, Photo, ViewMode } from "@/types/types";
import { create } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

interface PhotoStore {
  albums: Album[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  createAlbum: (title?: string) => Album;
  deleteAlbum: (id: string) => void;
  updateAlbumTitle: (id: string, title: string) => void;
  addPhotoToAlbum: (albumId: string, photo: Omit<Photo, 'id' | 'albumId' | 'createdAt'>) => void;
  deletePhoto: (albumId: string, photoId: string) => void;
  updatePhotoTitle: (albumId: string, photoId: string, title: string) => void;
}

const usePhotoStore = create<PhotoStore>()(
  persist(
    (set) => ({
      albums: [],
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      createAlbum: (title) => {
        const newAlbum: Album = {
          id: Date.now().toString(),
          title: title || `Новый альбом ${new Date().toLocaleDateString()}`,
          photos: [],
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          albums: [...state.albums, newAlbum]
        }));
        
        return newAlbum;
      },
      deleteAlbum: (id) => {
        set((state) => ({
          albums: state.albums.filter((album) => album.id !== id)
        }));
      },
      updateAlbumTitle: (id, title) => {
        set((state) => ({
          albums: state.albums.map((album) => 
            album.id === id ? { ...album, title } : album
          )
        }));
      },
      addPhotoToAlbum: (albumId, photoData) => {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          albumId,
          createdAt: new Date().toISOString(),
          ...photoData
        };
        
        set((state) => ({
          albums: state.albums.map((album) => 
            album.id === albumId 
              ? { 
                  ...album, 
                  photos: [...album.photos, newPhoto],
                  coverUrl: album.coverUrl || newPhoto.url 
                } 
              : album
          )
        }));
      },
      deletePhoto: (albumId, photoId) => {
        set((state) => ({
          albums: state.albums.map((album) => {
            if (album.id !== albumId) return album;
            
            const filteredPhotos = album.photos.filter(photo => photo.id !== photoId);
            const newCoverUrl = album.coverUrl && album.photos.find(p => p.id === photoId)?.url === album.coverUrl
              ? filteredPhotos[0]?.url || undefined
              : album.coverUrl;
              
            return {
              ...album,
              photos: filteredPhotos,
              coverUrl: newCoverUrl
            };
          })
        }));
      },
      updatePhotoTitle: (albumId, photoId, title) => {
        set((state) => ({
          albums: state.albums.map((album) => 
            album.id === albumId 
              ? { 
                  ...album, 
                  photos: album.photos.map(photo => 
                    photo.id === photoId ? { ...photo, title } : photo
                  )
                } 
              : album
          )
        }));
      }
    }),
    {
      name: 'photo-gallery-storage'
    }
  )
);

export default usePhotoStore;