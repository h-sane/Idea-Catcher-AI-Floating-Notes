
import React, { useState, useRef, useEffect } from 'react';
import { useIdeas } from '../context/IdeasContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Plus, 
  X, 
  Minimize2, 
  Maximize2, 
  Pin, 
  Clock, 
  Calendar, 
  FileText,
  ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from './ui/use-toast';

const FloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('new'); // 'new', 'past', 'reminder'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  
  const { addIdea, ideas, categories, togglePinIdea } = useIdeas();
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard shortcut (Ctrl+Shift+I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        setIsOpen(true);
        setIsCollapsed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && widgetRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Screen boundaries
        const maxX = window.innerWidth - widgetRef.current.offsetWidth;
        const maxY = window.innerHeight - widgetRef.current.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));
        
        setPosition({ x: boundedX, y: boundedY });
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        
        // Snap to edges if close enough
        if (widgetRef.current) {
          const snapThreshold = 20;
          const maxX = window.innerWidth - widgetRef.current.offsetWidth;
          const maxY = window.innerHeight - widgetRef.current.offsetHeight;
          
          let { x, y } = position;
          
          if (x < snapThreshold) x = 0;
          else if (x > maxX - snapThreshold) x = maxX;
          
          if (y < snapThreshold) y = 0;
          else if (y > maxY - snapThreshold) y = maxY;
          
          setPosition({ x, y });
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your idea",
        variant: "destructive"
      });
      return;
    }
    
    addIdea({
      title,
      content,
      isPinned: false,
      categoryIds: selectedCategoryIds,
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setSelectedCategoryIds([]);
    
    toast({
      title: "Idea Captured",
      description: "Your idea has been successfully saved",
    });
    
    // Suggest reminder based on content (simple NLP simulation)
    if (content.toLowerCase().includes('email') || content.toLowerCase().includes('send')) {
      toast({
        title: "Reminder Suggestion",
        description: "Would you like to set a reminder for tomorrow morning?",
        action: (
          <Button 
            className="bg-idea-purple text-white" 
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              tomorrow.setHours(9, 0, 0, 0);
              setReminderDate(format(tomorrow, "yyyy-MM-dd'T'HH:mm"));
              setActiveTab('reminder');
            }}
          >
            Set Reminder
          </Button>
        ),
      });
    }
  };
  
  const toggleCategory = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };
  
  const simulateNlpAssist = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title first",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate NLP processing
    toast({ title: "Analyzing idea...", description: "Using NLP to enhance your idea" });
    
    setTimeout(() => {
      // Simple keyword-based enhancement (simulating NLP)
      const titleLower = title.toLowerCase();
      let generatedContent = "";
      
      if (titleLower.includes("app") || titleLower.includes("application")) {
        generatedContent = "This application idea could address user needs in the current market. Consider researching similar applications to identify unique selling points and potential differentiators. The next steps might include creating wireframes, defining user stories, and planning technical architecture.";
      } else if (titleLower.includes("design") || titleLower.includes("ui") || titleLower.includes("ux")) {
        generatedContent = "This design concept should focus on user experience and visual hierarchy. Consider creating a mood board for inspiration and establish a consistent design system. User testing will be crucial to validate the design decisions.";
      } else if (titleLower.includes("blog") || titleLower.includes("article") || titleLower.includes("write")) {
        generatedContent = "For this writing project, outline key points to cover and identify the target audience. Research similar articles to find content gaps you can fill. Consider adding unique perspectives or data to make your content stand out.";
      } else if (titleLower.includes("meeting") || titleLower.includes("team") || titleLower.includes("project")) {
        generatedContent = "This meeting should have a clear agenda with time allocations for each topic. Prepare relevant materials in advance and consider who needs to attend. Send a summary of decisions and action items afterward.";
      } else {
        generatedContent = "This idea has potential for development. Consider defining specific goals, timelines, and resources needed. Breaking it down into smaller tasks might help with implementation. Researching similar concepts could provide valuable insights.";
      }
      
      setContent(generatedContent);
      
      // Auto-tag (simulating NLP categorization)
      const potentialCategories = [];
      
      if (titleLower.includes("work") || titleLower.includes("meeting") || titleLower.includes("client") || titleLower.includes("project")) {
        const workCategory = categories.find(c => c.name.toLowerCase() === "work");
        if (workCategory) potentialCategories.push(workCategory.id);
      }
      
      if (titleLower.includes("learn") || titleLower.includes("study") || titleLower.includes("course")) {
        const learningCategory = categories.find(c => c.name.toLowerCase() === "learning");
        if (learningCategory) potentialCategories.push(learningCategory.id);
      }
      
      if (titleLower.includes("app") || titleLower.includes("design") || titleLower.includes("develop") || titleLower.includes("build")) {
        const projectCategory = categories.find(c => c.name.toLowerCase() === "project");
        if (projectCategory) potentialCategories.push(projectCategory.id);
      }
      
      if (titleLower.includes("idea") || titleLower.includes("creative") || titleLower.includes("innovation")) {
        const inspirationCategory = categories.find(c => c.name.toLowerCase() === "inspiration");
        if (inspirationCategory) potentialCategories.push(inspirationCategory.id);
      }
      
      if (potentialCategories.length > 0) {
        setSelectedCategoryIds(potentialCategories);
        toast({
          title: "Categories Suggested",
          description: "NLP has suggested relevant categories for your idea"
        });
      }
    }, 1000);
  };
  
  const autoTagIdeas = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and description",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate NLP categorization
    toast({ title: "Analyzing content...", description: "Finding the best categories" });
    
    setTimeout(() => {
      const combinedText = (title + " " + content).toLowerCase();
      const newCategoryIds: string[] = [];
      
      // Simple keyword matching (simulating NLP)
      categories.forEach(category => {
        const categoryName = category.name.toLowerCase();
        
        // Work category keywords
        if (categoryName === "work" && (
          combinedText.includes("client") || 
          combinedText.includes("meeting") || 
          combinedText.includes("deadline") || 
          combinedText.includes("presentation") ||
          combinedText.includes("report")
        )) {
          newCategoryIds.push(category.id);
        }
        
        // Personal category keywords
        if (categoryName === "personal" && (
          combinedText.includes("family") || 
          combinedText.includes("home") || 
          combinedText.includes("personal") || 
          combinedText.includes("health") ||
          combinedText.includes("hobby")
        )) {
          newCategoryIds.push(category.id);
        }
        
        // Project category keywords
        if (categoryName === "project" && (
          combinedText.includes("develop") || 
          combinedText.includes("build") || 
          combinedText.includes("create") || 
          combinedText.includes("launch") ||
          combinedText.includes("project") ||
          combinedText.includes("app") ||
          combinedText.includes("website")
        )) {
          newCategoryIds.push(category.id);
        }
        
        // Inspiration category keywords
        if (categoryName === "inspiration" && (
          combinedText.includes("idea") || 
          combinedText.includes("inspiration") || 
          combinedText.includes("creative") || 
          combinedText.includes("concept") ||
          combinedText.includes("innovative") ||
          combinedText.includes("vision")
        )) {
          newCategoryIds.push(category.id);
        }
        
        // Learning category keywords
        if (categoryName === "learning" && (
          combinedText.includes("learn") || 
          combinedText.includes("study") || 
          combinedText.includes("course") || 
          combinedText.includes("tutorial") ||
          combinedText.includes("training") ||
          combinedText.includes("skill")
        )) {
          newCategoryIds.push(category.id);
        }
      });
      
      if (newCategoryIds.length > 0) {
        setSelectedCategoryIds(newCategoryIds);
        toast({
          title: "Auto-Tagging Complete",
          description: `Added ${newCategoryIds.length} categories to your idea`
        });
      } else {
        toast({
          title: "No Matching Categories",
          description: "Try adding more details to your idea"
        });
      }
    }, 1000);
  };
  
  if (!isOpen) {
    return (
      <Button
        className="fixed z-50 rounded-full w-12 h-12 flex items-center justify-center bg-idea-purple text-white shadow-lg hover:bg-idea-purple/90"
        style={{ left: position.x, top: position.y }}
        onClick={() => setIsOpen(true)}
        aria-label="Open idea widget"
      >
        <Plus className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <Card
      ref={widgetRef}
      className={`fixed z-50 shadow-lg overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'w-12 h-12' : 'w-80'
      }`}
      style={{ left: position.x, top: position.y }}
    >
      <div 
        className="bg-idea-purple text-white p-2 flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        {!isCollapsed && (
          <div className="text-sm font-bold">IdeaNest Widget</div>
        )}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-idea-purple/90"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-idea-purple/90"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <>
          <div className="flex border-b">
            <Button
              variant={activeTab === 'new' ? 'default' : 'ghost'}
              className={`flex-1 rounded-none ${
                activeTab === 'new' ? 'bg-idea-purple text-white' : ''
              }`}
              onClick={() => setActiveTab('new')}
            >
              New
            </Button>
            <Button
              variant={activeTab === 'past' ? 'default' : 'ghost'}
              className={`flex-1 rounded-none ${
                activeTab === 'past' ? 'bg-idea-purple text-white' : ''
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </Button>
            <Button
              variant={activeTab === 'reminder' ? 'default' : 'ghost'}
              className={`flex-1 rounded-none ${
                activeTab === 'reminder' ? 'bg-idea-purple text-white' : ''
              }`}
              onClick={() => setActiveTab('reminder')}
            >
              Reminder
            </Button>
          </div>
          
          <div className="p-3 max-h-96 overflow-y-auto">
            {activeTab === 'new' && (
              <div className="space-y-3">
                <Input
                  placeholder="Idea title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Describe your idea..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isSelected = selectedCategoryIds.includes(category.id);
                    return (
                      <Badge
                        key={category.id}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer ${
                          isSelected ? `bg-idea-${category.color} hover:bg-idea-${category.color}/90` : ''
                        }`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-idea-purple hover:bg-idea-purple/90" 
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-shrink-0"
                    onClick={simulateNlpAssist}
                  >
                    NLP Assist
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={autoTagIdeas}
                  >
                    Auto Tag
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'past' && (
              <div className="space-y-3">
                <div className="text-sm font-medium mb-2">Recent Ideas</div>
                {ideas.slice(0, 5).map((idea) => (
                  <div 
                    key={idea.id} 
                    className="p-2 border rounded hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-medium line-clamp-1">{idea.title}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePinIdea(idea.id)}
                      >
                        <Pin className={`h-3 w-3 ${idea.isPinned ? 'fill-idea-purple text-idea-purple' : ''}`} />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {idea.content}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {categories
                        .filter((cat) => idea.categoryIds.includes(cat.id))
                        .map((cat) => (
                          <Badge 
                            key={cat.id} 
                            variant="secondary"
                            className={`bg-idea-${cat.color}/10 text-idea-${cat.color} text-xs`}
                          >
                            {cat.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))}
                {ideas.length > 5 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    View All <ArrowDown className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
            
            {activeTab === 'reminder' && (
              <div className="space-y-3">
                <div className="text-sm font-medium mb-2">Set Reminder</div>
                <Input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                      const now = new Date();
                      now.setHours(now.getHours() + 1, 0, 0, 0);
                      setReminderDate(format(now, "yyyy-MM-dd'T'HH:mm"));
                    }}
                  >
                    <Clock className="mr-1 h-4 w-4" /> +1h
                  </Button>
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(9, 0, 0, 0);
                      setReminderDate(format(tomorrow, "yyyy-MM-dd'T'HH:mm"));
                    }}
                  >
                    <Calendar className="mr-1 h-4 w-4" /> Tomorrow
                  </Button>
                </div>
                <Button 
                  className="w-full bg-idea-purple hover:bg-idea-purple/90"
                  onClick={() => {
                    if (reminderDate) {
                      toast({
                        title: "Reminder Set",
                        description: `We'll remind you on ${new Date(reminderDate).toLocaleString()}`
                      });
                    } else {
                      toast({
                        title: "Error",
                        description: "Please select a reminder date and time",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Set Reminder
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default FloatingWidget;
