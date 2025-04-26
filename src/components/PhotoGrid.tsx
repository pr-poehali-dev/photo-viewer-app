import React from "react";
import { Photo, ViewMode } from "@/types/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import usePhotoStore from "@/lib/store";

interface PhotoItemProps {
  photo: Photo;
  viewMode: ViewMode;
}

const PhotoItem = ({ photo, viewMode }: PhotoItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(photo.title);
  const { updatePhotoTitle, deletePhoto } = usePhotoStore();

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    if (title.trim()) {
      updatePhotoTitle(photo.albumId, photo.id, title);
    } else {
      setTitle(photo.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitle(photo.title);
      setIsEditing(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-3 border-b hover:bg-muted/30 transition-colors">
        <div className="w-16 h-16 shrink-0">
          <img 
            src={photo.url} 
            alt={photo.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-8"
            />
          ) : (
            <p className="text-sm font-medium truncate">{photo.title}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditTitle}>
              <Edit2 size={16} className="mr-2" />
              Переименовать
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => deletePhoto(photo.albumId, photo.id)}
            >
              <Trash2 size={16} className="mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className={`relative ${viewMode === 'grid' ? 'pb-[100%]' : ''} overflow-hidden`}>
        <img
          src={photo.url}
          alt={photo.title}
          className={`${viewMode === 'grid' ? 'absolute inset-0' : ''} w-full h-full object-cover`}
        />
      </div>
      <CardFooter className="p-2 min-h-[40px] justify-between items-center">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-8"
          />
        ) : (
          <p className="text-sm truncate flex-1">{photo.title}</p>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditTitle}>
              <Edit2 size={16} className="mr-2" />
              Переименовать
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => deletePhoto(photo.albumId, photo.id)}
            >
              <Trash2 size={16} className="mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

interface PhotoGridProps {
  photos: Photo[];
  viewMode: ViewMode;
}

const PhotoGrid = ({ photos, viewMode }: PhotoGridProps) => {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p>Нет фотографий</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="p-4">
        {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (viewMode === 'masonry') {
    // Simple masonry implementation with CSS columns
    return (
      <div className="p-2 columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="mb-2 break-inside-avoid">
            <PhotoItem photo={photo} viewMode={viewMode} />
          </div>
        ))}
      </div>
    );
  }

  // Default grid view
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
      {photos.map((photo) => (
        <PhotoItem key={photo.id} photo={photo} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default PhotoGrid;
