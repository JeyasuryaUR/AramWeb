import { collection, addDoc, getDocs, doc, updateDoc, getDoc, query, where, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";

export const updatePostLikes = async (postId: string, userId: string, isLiked: boolean) => {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);

  if (postDoc.exists()) {
    const postData = postDoc.data();
    if (isLiked) {
      await updateDoc(postRef, {
        likes: postData.likes + 1,
        likedBy: arrayUnion(userId),
      });
    } else {
      await updateDoc(postRef, {
        likes: postData.likes - 1,
        likedBy: arrayRemove(userId),
      });
    }
  }
};

export const fetchPosts = async (): Promise<Post[]> => {
  const posts: Post[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        userId: data.userId,
        displayName: data.displayName,
        img: data.img,
        content: data.content,
        likes: data.likes,
        likedBy: data.likedBy || [], // Ensure likedBy is an array
        location: data.location,
        urgency: data.urgency,
        relatedToNeedy: data.relatedToNeedy,
        date: data.date.toDate(), // Convert Firestore timestamp to Date
      });
    });
  } catch (e) {
    console.error("Error fetching posts: ", e);
  }
  return posts;
};

export const getUserPosts = async (userId: string) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        userId: data.userId,
        displayName: data.displayName,
        img: data.img,
        content: data.content,
        likes: data.likes,
        likedBy: data.likedBy || [], // Ensure likedBy is an array
        location: data.location,
        urgency: data.urgency,
        relatedToNeedy: data.relatedToNeedy,
        date: data.date.toDate(), // Convert Firestore timestamp to Date
      } as Post);
    });
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};

export const addPost = async (post: Post) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), post);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const fetchPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        userId: data.userId,
        displayName: data.displayName,
        img: data.img,
        content: data.content,
        likes: data.likes,
        likedBy: data.likedBy || [], // Ensure likedBy is an array
        location: data.location,
        urgency: data.urgency,
        relatedToNeedy: data.relatedToNeedy,
        date: data.date.toDate(), // Convert Firestore timestamp to Date
        status: data.status, // Add status field
      } as Post;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error fetching post by ID: ", e);
    return null;
  }
};