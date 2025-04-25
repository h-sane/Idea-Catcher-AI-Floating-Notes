
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Idea, Category } from '../types';

// Sample categories
const initialCategories: Category[] = [
  { id: '1', name: 'Work', color: 'purple' },
  { id: '2', name: 'Personal', color: 'blue' },
  { id: '3', name: 'Project', color: 'green' },
  { id: '4', name: 'Inspiration', color: 'yellow' },
  { id: '5', name: 'Learning', color: 'pink' },
];

// Sample ideas
const initialIdeas: Idea[] = [
  {
    id: '1',
    title: 'New Marketing Strategy',
    content: 'Develop a content marketing strategy focused on educational blog posts and video tutorials.',
    isPinned: true,
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 3, 15).toISOString(),
    categoryIds: ['1'],
  },
  {
    id: '2',
    title: 'Learn TypeScript',
    content: 'Find a comprehensive TypeScript course on Udemy or Coursera.',
    isPinned: false,
    createdAt: new Date(2023, 3, 10).toISOString(),
    updatedAt: new Date(2023, 3, 10).toISOString(),
    categoryIds: ['5'],
  },
  {
    id: '3',
    title: 'New App Idea: Recipe Manager',
    content: 'Create an app that lets users save recipes from websites and organizes them into collections.',
    isPinned: false,
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
    categoryIds: ['3', '4'],
  },
  {
    id: '4',
    title: 'Birthday Gift for Mom',
    content: 'Find a nice photo frame or custom photo album for her birthday next month.',
    isPinned: true,
    createdAt: new Date(2023, 2, 28).toISOString(),
    updatedAt: new Date(2023, 2, 28).toISOString(),
    categoryIds: ['2'],
  },
  {
    id: '5',
    title: 'Website Redesign Concepts',
    content: 'Explore minimalist design principles for the upcoming website refresh project.',
    isPinned: false,
    createdAt: new Date(2023, 2, 20).toISOString(),
    updatedAt: new Date(2023, 2, 20).toISOString(),
    categoryIds: ['1', '3'],
  },
];

type IdeasContextType = {
  ideas: Idea[];
  categories: Category[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIdea: (idea: Idea) => void;
  deleteIdea: (id: string) => void;
  togglePinIdea: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export function useIdeas() {
  const context = useContext(IdeasContext);
  if (context === undefined) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
}

export function IdeasProvider({ children }: { children: React.ReactNode }) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Generate a random ID (for demo purposes)
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newIdea: Idea = {
      ...idea,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setIdeas([newIdea, ...ideas]);
  };

  const updateIdea = (updatedIdea: Idea) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === updatedIdea.id
          ? { ...updatedIdea, updatedAt: new Date().toISOString() }
          : idea
      )
    );
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

  const togglePinIdea = (id: string) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === id
          ? { ...idea, isPinned: !idea.isPinned, updatedAt: new Date().toISOString() }
          : idea
      )
    );
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    setCategories([...categories, newCategory]);
  };

  const value = {
    ideas,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    addIdea,
    updateIdea,
    deleteIdea,
    togglePinIdea,
    addCategory,
    searchTerm,
    setSearchTerm,
  };

  return <IdeasContext.Provider value={value}>{children}</IdeasContext.Provider>;
}
