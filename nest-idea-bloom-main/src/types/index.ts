
export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Idea = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  categoryIds: string[];
};
