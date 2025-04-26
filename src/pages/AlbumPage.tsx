import React from "react";
import { useParams, Navigate } from "react-router-dom";
import usePhotoStore from "@/lib/store";
import PhotoGrid from "@/components/PhotoGrid";
import Header from "@/components/Header";
import PhotoUploader from "@/components/PhotoUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const { albums, viewMode } = usePhotoStore();
  
  if (!id) return <Navigate to="/" />;
  
  const album = albums.find(album => album.id === id);
  
  if (!album) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        showBack 
        title={album.title} 
        showViewOptions
      />
      
      <main className="flex-1">
        <Tabs defaultValue="photos">
          <div className="border-b">
            <div className="container mx-auto px-4">
              <TabsList className="h-12">
                <TabsTrigger value="photos">Фотографии</TabsTrigger>
                <TabsTrigger value="upload">Загрузить</TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="photos" className="mt-0">
            <PhotoGrid photos={album.photos} viewMode={viewMode} />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-0">
            <PhotoUploader albumId={id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AlbumPage;
