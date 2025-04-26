export interface Photo {
  id: string;
  url: string;
  title: string;
  albumId: string;
  createdAt: string;
}

export interface Album {
  id: string;
  title: string;
  coverUrl?: string;
  photos: Photo[];
  createdAt: string;
}

export type ViewMode = 'grid' | 'masonry' | 'list';
