
import React from 'react';
import { useIdeas } from '../context/IdeasContext';
import IdeaCard from './IdeaCard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Pin, FileText } from 'lucide-react';
import { exportIdeasToPdf } from '../utils/pdfExport';

export default function IdeasGrid() {
  const { ideas, categories, selectedCategoryId, searchTerm } = useIdeas();

  // Filter ideas based on selected category and search term
  const filteredIdeas = ideas.filter((idea) => {
    // Filter by category if one is selected
    const categoryMatch = selectedCategoryId
      ? idea.categoryIds.includes(selectedCategoryId)
      : true;

    // Filter by search term
    const searchMatch = searchTerm
      ? idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return categoryMatch && searchMatch;
  });

  // Separate pinned and unpinned ideas
  const pinnedIdeas = filteredIdeas.filter((idea) => idea.isPinned);
  const unpinnedIdeas = filteredIdeas.filter((idea) => !idea.isPinned);

  // Get selected category name if applicable
  const selectedCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)
    : null;

  const handleExportAllToPdf = () => {
    // Export all filtered ideas
    const filterName = selectedCategory 
      ? `Category: ${selectedCategory.name}` 
      : (searchTerm ? `Search: ${searchTerm}` : 'All Ideas');
    
    exportIdeasToPdf(filteredIdeas, categories, filterName);
  };

  return (
    <div className="space-y-8">
      {/* Header with filters info and export button */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            {selectedCategory ? (
              <>
                <span className={`h-3 w-3 rounded-full bg-idea-${selectedCategory.color} mr-2`}></span>
                {selectedCategory.name} Ideas
              </>
            ) : (
              'All Ideas'
            )}
            {searchTerm && (
              <Badge variant="secondary" className="ml-3">
                Search: {searchTerm}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {filteredIdeas.length > 0 && (
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportAllToPdf}
          >
            <FileText className="h-4 w-4" />
            Export to PDF
          </Button>
        )}
      </div>

      {/* Pinned ideas section */}
      {pinnedIdeas.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-muted-foreground flex items-center">
            <Pin className="h-4 w-4 mr-2" fill="currentColor" /> Pinned Ideas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      )}

      {/* Other ideas section */}
      {unpinnedIdeas.length > 0 && (
        <div className="space-y-4">
          {pinnedIdeas.length > 0 && (
            <h3 className="font-medium text-muted-foreground">Other Ideas</h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-muted rounded-full p-4 inline-block mb-4">
            <svg
              className="h-12 w-12 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">No ideas found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {searchTerm
              ? `No ideas match your search for "${searchTerm}"`
              : selectedCategoryId
              ? "No ideas in this category yet"
              : "Start by adding your first idea!"}
          </p>
        </div>
      )}
    </div>
  );
}
