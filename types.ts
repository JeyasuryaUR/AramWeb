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
  imgs: string[];
  content: string;
  likes: number;
  likedBy?: string[];
  location: [number, number]; // Change to array of [latitude, longitude]
  landmark: string; // Add landmark field
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