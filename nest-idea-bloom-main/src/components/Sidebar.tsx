
import React from 'react';
import { useIdeas } from '../context/IdeasContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Home } from 'lucide-react';

export default function Sidebar() {
  const { categories, selectedCategoryId, setSelectedCategoryId, searchTerm, setSearchTerm } = useIdeas();

  return (
    <div className="h-screen bg-sidebar flex flex-col text-sidebar-foreground">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="bg-accent rounded-md p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
              <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </span>
          IdeaNest
        </h1>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-sidebar-foreground/50" />
          <Input
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-sidebar-accent text-sidebar-foreground border-sidebar-border placeholder:text-sidebar-foreground/50"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1 mb-2">
          <Button
            variant={selectedCategoryId === null ? "default" : "ghost"}
            className={`w-full justify-start text-left ${selectedCategoryId === null ? "bg-sidebar-primary" : "hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}
            onClick={() => setSelectedCategoryId(null)}
          >
            <Home className="mr-2 h-4 w-4" />
            All Ideas
          </Button>
          
          <h2 className="font-semibold text-sidebar-foreground/70 px-3 py-2 text-sm">Categories</h2>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                selectedCategoryId === category.id
                  ? "bg-sidebar-primary"
                  : "hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              <span className={`h-2 w-2 rounded-full bg-idea-${category.color} mr-2`}></span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <Button className="w-full" disabled>
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>
    </div>
  );
}
