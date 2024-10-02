"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchPostById } from "@/services/posts";
import { Post as PostType } from "@/types";

export default function PostPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    if (postId) {
      const loadPost = async () => {
        const fetchedPost = await fetchPostById(postId as string);
        if (fetchedPost) {
          // Hardcode some random statuses for demonstration
          const statuses = ["urgent", "undertaken", "need to take action"];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          setPost({ ...fetchedPost, status: randomStatus });
        } else {
          alert("Error fetching post");
        }
      };
      loadPost();
    }
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-4 flex flex-col items-center justify-center max-w-4xl min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <img src={post.img} alt={post.content} className="w-full h-64 object-cover rounded-lg mb-4" />
        <h1 className="text-3xl font-bold mb-4">{post.displayName}</h1>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-4 py-2 rounded-full ${post.status === "urgent" ? "bg-red-500 text-white" : post.status === "undertaken" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}>
            {post.status}
          </span>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              Raise Fund
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}