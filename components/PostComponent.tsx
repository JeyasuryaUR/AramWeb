// Post.tsx
import React from "react";
import { Post as PostType } from "@/types";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

interface PostProps {
  post: PostType;
  likedPosts: string[];
  handleLike: (postId: string, currentLikes: number) => void;
}

const Post: React.FC<PostProps> = ({ post, likedPosts, handleLike }) => {
  return (
    <div className="z-1 w-full h-fit sm:w-1/2 lg:w-1/3 px-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div>
          {post.displayName}
        </div>
        {post.img && (
          <div className="relative mb-4">
            <img
              src={post.img}
              alt="Post Image"
              width={700}
              height={475}
              className="rounded-lg"
            />
          </div>
        )}
        <div className="text-gray-800">
          <p className="mt-2 line-clamp-3">{post.content}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-teal-400">
              {new Date(post.date).toLocaleDateString()}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="flex text-gray-600">{post.likes}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Post;