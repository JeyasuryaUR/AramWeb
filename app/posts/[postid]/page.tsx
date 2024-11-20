"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchPostById, updatePostLikes } from "@/services/posts";
import { Post as PostType, Comment as CommentType } from "@/types";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { LiaComment } from "react-icons/lia";
import { useSwipeable } from "react-swipeable";

export default function PostPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (postId) {
      const loadPost = async () => {
        const fetchedPost = await fetchPostById(postId as string);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          alert("Error fetching post");
        }
      };
      loadPost();
    }
  }, [postId]);

  const handleLike = async () => {
    if (post && user) {
      const isLiked = post.likedBy?.includes(user.uid);
      await updatePostLikes(post.id, user.uid, !isLiked);
      setPost({
        ...post,
        likes: isLiked ? post.likes - 1 : post.likes + 1,
        likedBy: isLiked
          ? post.likedBy?.filter((id) => id !== user.uid)
          : [...(post.likedBy || []), user.uid],
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
    // Add logic to save the comment to the database
    const newCommentObj: CommentType = {
      id: "", // Firestore will generate the ID
      displayName: user?.displayName || "Anonymous",
      postId: postId as string,
      userId: user?.uid || "Anonymous",
      content: newComment,
      createdAt: new Date(),
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (post?.imgs.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + (post?.imgs.length || 1)) % (post?.imgs.length || 1)
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
  });

  if (!post) {
    return <div className="flex w-full h-full justify-center items-center">Loading...</div>;
  }

  return (
    <div className="mx-auto p-4 flex flex-col items-start justify-start max-w-3xl min-h-screen">
      <button
        onClick={() => router.push("/")}
        className="px-8 py-2 mb-4 bg-secondary text-white rounded-full hover:bg-gray-600"
      >
        BACK
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <div className="relative mb-4" {...handlers}>
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
            {post.imgs.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Post Image ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {post.imgs.length > 1 && (
              <>
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
                  onClick={handlePrevImage}
                >
                  &lt;
                </button>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
                  onClick={handleNextImage}
                >
                  &gt;
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {post.imgs.map((_, index) => (
                    <span
                      key={index}
                      className={`block w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-gray-400"
                      }`}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{post.displayName}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 text-red-500"
            >
              {post.likedBy?.includes(user?.uid || "") ? (
                <IoHeart className="text-2xl" />
              ) : (
                <IoHeartOutline className="text-2xl" />
              )}
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500">
              <LiaComment className="text-2xl" />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-4 py-2 rounded-full ${
              post.urgency > 7
                ? "bg-red-500 text-white"
                : post.urgency > 4
                ? "bg-yellow-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {post.urgency > 7
              ? "High Urgency"
              : post.urgency > 4
              ? "Medium Urgency"
              : "Low Urgency"}
          </span>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">
              Report Spam
            </button>
          </div>
        </div>
        <h3 className="pt-2 text-center text-zinc-600 border-t-2">{post.location}</h3>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full mt-4">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg"
            placeholder="Add your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="ml-4 px-4 py-2 bg-secondary text-white rounded-full hover:bg-gray-600"
          >
            Post
          </button>
        </div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 p-2 rounded-full">
                  <LiaComment className="text-gray-500" />
                </div>
                <div>
                  <p className="font-bold">{comment.displayName}</p>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-gray-500 text-sm">
                    {comment.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}