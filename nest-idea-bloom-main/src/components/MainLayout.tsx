
import React from 'react';
import Sidebar from './Sidebar';
import { IdeasProvider } from '../context/IdeasContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from './ui/sheet';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <IdeasProvider>
      <div className="flex min-h-screen">
        {/* Sidebar for desktop */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Mobile sidebar with sheet */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="container max-w-6xl py-6 px-4 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </IdeasProvider>
  );
}
