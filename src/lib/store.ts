import { Album, Photo, ViewMode } from "@/types/types";
import { create } from 'zustand';

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

// Создаем хранилище без middleware persist - будем использовать localStorage напрямую
const loadState = (): { albums: Album[], viewMode: ViewMode } => {
  try {
    const savedState = localStorage.getItem('photo-gallery-storage');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
  return { albums: [], viewMode: 'grid' };
};

const saveState = (state: { albums: Album[], viewMode: ViewMode }) => {
  try {
    localStorage.setItem('photo-gallery-storage', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
};

const initialState = loadState();

const usePhotoStore = create<PhotoStore>()((set, get) => ({
  albums: initialState.albums || [],
  viewMode: initialState.viewMode || 'grid',
  
  setViewMode: (mode) => {
    set({ viewMode: mode });
    saveState({ ...get(), viewMode: mode });
  },
  
  createAlbum: (title) => {
    const newAlbum: Album = {
      id: Date.now().toString(),
      title: title || `Новый альбом ${new Date().toLocaleDateString()}`,
      photos: [],
      createdAt: new Date().toISOString(),
    };
    
    set((state) => {
      const newState = { ...state, albums: [...state.albums, newAlbum] };
      saveState(newState);
      return newState;
    });
    
    return newAlbum;
  },
  
  deleteAlbum: (id) => {
    set((state) => {
      const newState = { ...state, albums: state.albums.filter((album) => album.id !== id) };
      saveState(newState);
      return newState;
    });
  },
  
  updateAlbumTitle: (id, title) => {
    set((state) => {
      const newState = {
        ...state,
        albums: state.albums.map((album) => 
          album.id === id ? { ...album, title } : album
        )
      };
      saveState(newState);
      return newState;
    });
  },
  
  addPhotoToAlbum: (albumId, photoData) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      albumId,
      createdAt: new Date().toISOString(),
      ...photoData
    };
    
    set((state) => {
      const newState = {
        ...state,
        albums: state.albums.map((album) => 
          album.id === albumId 
            ? { 
                ...album, 
                photos: [...album.photos, newPhoto],
                coverUrl: album.coverUrl || newPhoto.url 
              } 
            : album
        )
      };
      saveState(newState);
      return newState;
    });
  },
  
  deletePhoto: (albumId, photoId) => {
    set((state) => {
      const updatedAlbums = state.albums.map((album) => {
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
      });
      
      const newState = { ...state, albums: updatedAlbums };
      saveState(newState);
      return newState;
    });
  },
  
  updatePhotoTitle: (albumId, photoId, title) => {
    set((state) => {
      const newState = {
        ...state,
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
      };
      saveState(newState);
      return newState;
    });
  }
}));

export default usePhotoStore;