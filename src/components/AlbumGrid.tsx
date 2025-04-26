import React from "react";
import { Link } from "react-router-dom";
import { Album } from "@/types/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import usePhotoStore from "@/lib/store";

const NewAlbumCard = () => {
  const createAlbum = usePhotoStore((state) => state.createAlbum);
  
  return (
    <Card 
      className="flex flex-col justify-center items-center h-full min-h-[200px] cursor-pointer hover:border-primary transition-colors duration-200"
      onClick={() => createAlbum()}
    >
      <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
        <Plus size={36} className="mb-2" />
        <p className="text-sm font-medium">Создать альбом</p>
      </div>
    </Card>
  );
};

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(album.title);
  const { deleteAlbum, updateAlbumTitle } = usePhotoStore();

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    if (title.trim()) {
      updateAlbumTitle(album.id, title);
    } else {
      setTitle(album.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitle(album.title);
      setIsEditing(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <Link to={`/album/${album.id}`} className="flex-1">
        <div className="relative pb-[100%] overflow-hidden rounded-t-md">
          {album.coverUrl ? (
            <img
              src={album.coverUrl}
              alt={album.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Нет фото</p>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
            <p className="text-white text-xs font-medium">
              {album.photos.length} фото
            </p>
          </div>
        </div>
      </Link>
      <CardFooter className="p-3 justify-between items-center">
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
          <p className="text-sm font-medium truncate flex-1">{album.title}</p>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditTitle}>
              Переименовать
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => deleteAlbum(album.id)}
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

interface AlbumGridProps {
  albums: Album[];
}

const AlbumGrid = ({ albums }: AlbumGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      <NewAlbumCard />
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
};

export default AlbumGrid;
