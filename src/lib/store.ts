import { useState, useEffect } from 'react';
import { Album, Photo, ViewMode } from "@/types/types";

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

// Создаём простое хранилище на основе событий и localStorage
class SimpleStore implements PhotoStore {
  private listeners: (() => void)[] = [];
  albums: Album[] = [];
  viewMode: ViewMode = 'grid';

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedState = localStorage.getItem('photo-gallery-storage');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.albums = state.albums || [];
        this.viewMode = state.viewMode || 'grid';
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }

  private saveState() {
    try {
      localStorage.setItem('photo-gallery-storage', JSON.stringify({
        albums: this.albums,
        viewMode: this.viewMode,
      }));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  private notify() {
    this.saveState();
    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState() {
    return {
      albums: this.albums,
      viewMode: this.viewMode,
      setViewMode: this.setViewMode,
      createAlbum: this.createAlbum,
      deleteAlbum: this.deleteAlbum,
      updateAlbumTitle: this.updateAlbumTitle,
      addPhotoToAlbum: this.addPhotoToAlbum,
      deletePhoto: this.deletePhoto,
      updatePhotoTitle: this.updatePhotoTitle,
    };
  }

  setViewMode = (mode: ViewMode) => {
    this.viewMode = mode;
    this.notify();
  };

  createAlbum = (title?: string): Album => {
    const newAlbum: Album = {
      id: Date.now().toString(),
      title: title || `Новый альбом ${new Date().toLocaleDateString()}`,
      photos: [],
      createdAt: new Date().toISOString(),
    };

    this.albums = [...this.albums, newAlbum];
    this.notify();
    return newAlbum;
  };

  deleteAlbum = (id: string) => {
    this.albums = this.albums.filter((album) => album.id !== id);
    this.notify();
  };

  updateAlbumTitle = (id: string, title: string) => {
    this.albums = this.albums.map((album) =>
      album.id === id ? { ...album, title } : album
    );
    this.notify();
  };

  addPhotoToAlbum = (albumId: string, photoData: Omit<Photo, 'id' | 'albumId' | 'createdAt'>) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      albumId,
      createdAt: new Date().toISOString(),
      ...photoData
    };

    this.albums = this.albums.map((album) =>
      album.id === albumId
        ? {
            ...album,
            photos: [...album.photos, newPhoto],
            coverUrl: album.coverUrl || newPhoto.url
          }
        : album
    );
    this.notify();
  };

  deletePhoto = (albumId: string, photoId: string) => {
    this.albums = this.albums.map((album) => {
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
    this.notify();
  };

  updatePhotoTitle = (albumId: string, photoId: string, title: string) => {
    this.albums = this.albums.map((album) =>
      album.id === albumId
        ? {
            ...album,
            photos: album.photos.map(photo =>
              photo.id === photoId ? { ...photo, title } : photo
            )
          }
        : album
    );
    this.notify();
  };
}

// Создаем единственный экземпляр хранилища
const store = new SimpleStore();

// Хук для использования хранилища в компонентах React
export function usePhotoStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, []);

  return state;
}

export default usePhotoStore;
