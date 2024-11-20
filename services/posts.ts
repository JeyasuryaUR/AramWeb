import { collection, addDoc, getDocs, doc, updateDoc, getDoc, query, where, orderBy, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Post } from "@/types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

const updatePostLikes = async (postId: string, userId: string, isLiked: boolean) => {
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

const fetchPosts = async (): Promise<Post[]> => {
  const posts: Post[] = [];
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        userId: data.userId,
        displayName: data.displayName,
        imgs: data.imgs || [],
        content: data.content,
        likes: data.likes,
        likedBy: data.likedBy || [],
        location: data.location,
        landmark: data.landmark,
        urgency: data.urgency,
        relatedToNeedy: data.relatedToNeedy,
        date: data.date.toDate(),
      });
    });
  } catch (e) {
    console.error("Error fetching posts: ", e);
  }
  return posts;
};

const getUserPosts = async (userId: string) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        userId: data.userId,
        displayName: data.displayName,
        imgs: data.imgs || [],
        content: data.content,
        likes: data.likes,
        likedBy: data.likedBy || [],
        location: data.location,
        landmark: data.landmark,
        urgency: data.urgency,
        relatedToNeedy: data.relatedToNeedy,
        date: data.date.toDate(),
      } as Post);
    });
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};

const addPost = async (post: Post) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), post);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

const fetchPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const data = postDoc.data();
      console.log("Post data fetched:", data);
      return {
        id: postDoc.id,
        userId: data.userId,
        displayName: data.displayName,
        imgs: data.imgs || [],
        content: data.content,
        likes: data.likes,
        likedBy: data.likedBy || [],
        location: data.location,
        landmark: data.landmark,
        urgency: data.urgency,
        relatedToNeedy: data.relatedToNeedy,
        date: data.date.toDate(),
        status: data.status,
      } as Post;
    } else {
      console.error("Post not found");
      return null;
    }
  } catch (e) {
    console.error("Error fetching post by ID: ", e);
    return null;
  }
};

const compressAndUploadImage = async (file: File, fullName: string, postNumber: string): Promise<string> => {
  let compressedFile = file;

  if (file.size > 100 * 1024) {
    compressedFile = await imageCompression(file, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
  } else {
    compressedFile = await imageCompression(file, {
      maxSizeMB: file.size / 1024 / 1024 * 0.9,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
  }

  const imageName = generateImageName(fullName, postNumber);
  const storageRef = ref(storage, `images/${imageName}`);
  await uploadBytes(storageRef, compressedFile);
  return getDownloadURL(storageRef);
};

const generateImageName = (fullName: string, postNumber: string): string => {
  const sanitizedFullName = fullName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const currentDateTime = new Date().toLocaleString().replace(/[^a-z0-9]/gi, "");
  return `${sanitizedFullName}_${currentDateTime}_${postNumber}`;
};

export { fetchPosts, addPost, fetchPostById, getUserPosts, updatePostLikes, compressAndUploadImage };