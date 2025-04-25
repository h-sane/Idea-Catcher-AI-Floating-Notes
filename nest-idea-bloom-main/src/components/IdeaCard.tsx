
import React, { useState } from 'react';
import { Idea, Category } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useIdeas } from '../context/IdeasContext';
import { formatDistanceToNow } from 'date-fns';
import { Pin, FileText, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { exportIdeasToPdf } from '../utils/pdfExport';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const { categories, togglePinIdea, deleteIdea, updateIdea } = useIdeas();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(idea.title);
  const [editContent, setEditContent] = useState(idea.content);
  
  const ideaCategories = categories.filter((category) =>
    idea.categoryIds.includes(category.id)
  );

  const formattedDate = formatDistanceToNow(new Date(idea.updatedAt), { addSuffix: true });

  const handleExportToPdf = () => {
    exportIdeasToPdf([idea], categories, `Single Idea: ${idea.title}`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    deleteIdea(idea.id);
  };

  const handleSaveEdit = () => {
    updateIdea({
      ...idea,
      title: editTitle,
      content: editContent
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(idea.title);
    setEditContent(idea.content);
    setIsEditing(false);
  };

  return (
    <Card className={`idea-card ${idea.isPinned ? 'pinned-idea' : ''} animate-fade-in`}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-1 border rounded"
            autoFocus
          />
        ) : (
          <CardTitle className="text-lg font-medium line-clamp-2">{idea.title}</CardTitle>
        )}
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Open menu</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportToPdf} className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => togglePinIdea(idea.id)} className="cursor-pointer">
                  <Pin className={`h-4 w-4 mr-2 ${idea.isPinned ? 'fill-idea-purple text-idea-purple' : ''}`} />
                  {idea.isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick} className="cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-1 border rounded"
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground line-clamp-3">{idea.content}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap gap-1">
          {ideaCategories.map((category) => (
            <Badge key={category.id} variant="secondary" className={`bg-idea-${category.color}/10 text-idea-${category.color} hover:bg-idea-${category.color}/20`}>
              {category.name}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Updated {formattedDate}</p>
      </CardFooter>
    </Card>
  );
}
