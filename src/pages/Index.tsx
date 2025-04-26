import React from "react";
import usePhotoStore from "@/lib/store";
import AlbumGrid from "@/components/AlbumGrid";
import Header from "@/components/Header";

const Index = () => {
  const albums = usePhotoStore((state) => state.albums);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Мои альбомы" />
      
      <main className="flex-1">
        <AlbumGrid albums={albums} />
      </main>
    </div>
  );
};

export default Index;
