export type ViewMode = 'grid' | 'masonry' | 'list';

export interface Photo {
  id: string;
  albumId: string;
  url: string;
  title: string;
  createdAt: string;
}

export interface Album {
  id: string;
  title: string;
  coverUrl?: string;
  photos: Photo[];
  createdAt: string;
}
