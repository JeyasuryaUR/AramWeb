export interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio?: string;
  profilePicture?: string;
}

export interface Post {
  id: string;
  userId: string;
  displayName: string;
  img?: string;
  content: string;
  likes: number;
  likedBy?: string[]; // New field to store user IDs who liked the post
  location: string;
  urgency: number;
  relatedToNeedy: boolean;
  status?: string;
  date: Date;
}

export interface Comment {
  id: string;
  displayName: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}