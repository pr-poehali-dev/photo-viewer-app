import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Grid, List, LayoutGrid } from "lucide-react";
import usePhotoStore from "@/lib/store";
import { ViewMode } from "@/types/types";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  showViewOptions?: boolean;
}

const Header = ({ showBack = false, title = "Фотогалерея", showViewOptions = false }: HeaderProps) => {
  const { viewMode, setViewMode } = usePhotoStore();
  
  const viewOptions: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'grid', icon: <Grid size={18} />, label: 'Сетка' },
    { mode: 'masonry', icon: <LayoutGrid size={18} />, label: 'Мозаика' },
    { mode: 'list', icon: <List size={18} />, label: 'Список' },
  ];

  return (
    <header className="sticky top-0 z-10 bg-background border-b py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        {showViewOptions && (
          <div className="flex items-center gap-1">
            {viewOptions.map(({ mode, icon, label }) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="flex items-center gap-2"
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
