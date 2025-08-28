export interface MediaAttachment {
  id: string;
  s3_key: string;
  file_type: string;
}

export interface Author {
  id: string;
  username: string;
  image: string | null;
}

export interface Post {
  id: string;
  context: string | null;
  author_id: number;
  attachments: MediaAttachment[];
  created_at: string | null;
  author: Author;
  comments: Comment[]
}

export interface Comment {
  id: string;
  content: string;
  created_at: string | null;
  author: Author;
  parent_id: string | null;
}

export interface User {
  id: string,
  username: string,
  email: string,
  school: string,
  biography: string,
  created_at: string,
  level: number,
  image: string | null,
  self_projects: Project[],
  projects: Project[],
  following: User[]
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string; // isoformat() → string
  author_id: string;
  category: string;
  is_complete: boolean;
  author: Author;
  members: Author[];
}

export interface Notification {
  id: string;
  receiver_id: string;
  sender_id: string;
  pointer_type: string;
  pointer_id: string;
  created_at: string;
  is_read: boolean;
  sender: User;
}