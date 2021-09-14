interface CommentCategorisation {
  category: string;
  subCategory: string;
  description: string;
}

interface CommentAuthor {
  fullName: string;
  email?: string;
}

export interface Comment {
  id: string;
  title?: string;
  description: string;
  categorisation?: CommentCategorisation;
  author: CommentAuthor;
  createdAt: string;
  targetType?: string;
  targetId?: string;
}
