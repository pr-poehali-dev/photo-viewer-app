import React from 'react';
import Header from '@/components/Header';
import AlbumGrid from '@/components/AlbumGrid';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-8">
        <AlbumGrid />
      </main>
    </div>
  );
};

export default Index;
