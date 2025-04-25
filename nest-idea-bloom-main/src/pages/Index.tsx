
import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import AddIdeaForm from '../components/AddIdeaForm';
import IdeasGrid from '../components/IdeasGrid';
import FloatingWidget from '../components/FloatingWidget';
import { Button } from '../components/ui/button';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const Index = () => {
  const [showWidget, setShowWidget] = useState(false);

  return (
    <MainLayout>
      <div className="relative">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowWidget(!showWidget)}
            className="flex items-center gap-2"
          >
            {showWidget ? (
              <>
                <ToggleRight className="h-4 w-4" />
                Hide Quick Access
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" />
                Show Quick Access
              </>
            )}
          </Button>
        </div>
        <div className="space-y-8">
          <AddIdeaForm />
          <IdeasGrid />
        </div>
        {showWidget && <FloatingWidget />}
      </div>
    </MainLayout>
  );
};

export default Index;
