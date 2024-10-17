// PostComponent.tsx
import React from "react";
import { Post as PostType } from "@/types";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";

interface PostProps {
  post: PostType;
  likedPosts: string[];
  handleLike: (postId: string, currentLikes: number) => void;
}

const urgencyColors = ["bg-green-500", "bg-yellow-500", "bg-red-500"];

const Post: React.FC<PostProps> = ({ post, likedPosts, handleLike }) => {
  return (
    <div className="w-full p-2">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
        <div className="text-lg sm:text-xl font-semibold mb-2">
          {post.displayName}
        </div>
        {post.img && (
          <div className="relative mb-4">
            <img
              src={post.img}
              alt="Post Image"
              className="rounded-lg w-full h-auto"
            />
          </div>
        )}
        <div className="text-gray-800">
          <p className="mt-2 text-sm sm:text-base line-clamp-3">{post.content}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-teal-400 text-xs sm:text-sm">
              {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="flex text-gray-600 text-xs sm:text-sm">{post.likes}</span>
              <button
                className={`flex ${
                  likedPosts.includes(post.id) ? "text-red-600" : "text-gray-600"
                } hover:text-red-700`}
                onClick={() => handleLike(post.id, post.likes)}
              >
                {likedPosts.includes(post.id) ? <IoHeart /> : <IoHeartOutline />}
              </button>
            </div>
          </div>
          <div className={`hidden mt-4 md:flex items-center justify-center ${urgencyColors[post.urgency]} text-white px-2 py-1 rounded-full`}>
            {post.urgency === 2 ? "High Urgency" : post.urgency === 1 ? "Medium Urgency" : "Low Urgency"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;