import React, { useState } from 'react';
import { useIdeas } from '../context/IdeasContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Plus, X, Mic, MicOff } from 'lucide-react';
import { toast } from './ui/use-toast';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function AddIdeaForm() {
  const { addIdea, categories } = useIdeas();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      setContent(prev => prev + ' ' + transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Error",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Speak now to add content to your idea...",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your idea.",
        variant: "destructive",
      });
      return;
    }

    addIdea({
      title,
      content,
      isPinned: false,
      categoryIds: selectedCategoryIds,
    });

    setTitle('');
    setContent('');
    setSelectedCategoryIds([]);

    toast({
      title: "Idea Added",
      description: "Your idea has been successfully added.",
    });
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };

  const handleNlpAssist = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title first",
        variant: "destructive"
      });
      return;
    }
    
    toast({ title: "Analyzing idea...", description: "Using NLP to enhance your idea" });
    
    setTimeout(() => {
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
    }, 1000);
  };
  
  const handleAutoTag = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and description",
        variant: "destructive"
      });
      return;
    }
    
    toast({ title: "Analyzing content...", description: "Finding the best categories" });
    
    setTimeout(() => {
      const combinedText = (title + " " + content).toLowerCase();
      const newCategoryIds: string[] = [];
      
      categories.forEach(category => {
        const categoryName = category.name.toLowerCase();
        
        if (categoryName === "work" && (
          combinedText.includes("client") || 
          combinedText.includes("meeting") || 
          combinedText.includes("deadline") || 
          combinedText.includes("presentation") ||
          combinedText.includes("report")
        )) {
          newCategoryIds.push(category.id);
        }
        
        if (categoryName === "personal" && (
          combinedText.includes("family") || 
          combinedText.includes("home") || 
          combinedText.includes("personal") || 
          combinedText.includes("health") ||
          combinedText.includes("hobby")
        )) {
          newCategoryIds.push(category.id);
        }
        
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

  return (
    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">Capture New Idea</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Idea title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Describe your idea..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                className="w-full"
                onClick={toggleListening}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Voice Input
                  </>
                )}
              </Button>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                type="button" 
                variant="outline" 
                className="h-full py-1 px-2 text-xs"
                onClick={handleNlpAssist}
              >
                NLP<br/>Assist
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="h-full py-1 px-2 text-xs"
                onClick={handleAutoTag}
              >
                Auto<br/>Tag
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Categories</p>
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
                    {isSelected ? (
                      <X className="ml-1 h-3 w-3" />
                    ) : (
                      <Plus className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <Check className="h-4 w-4 mr-2" /> Save Idea
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
