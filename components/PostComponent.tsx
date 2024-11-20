import React, { useState } from "react";
import { Post as PostType } from "@/types";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";

interface PostProps {
  post: PostType;
  likedPosts: string[];
  handleLike: (post: PostType) => void;
}

const urgencyGradients = [
  "bg-gradient-to-r from-yellow-400 to-yellow-600",
  "bg-gradient-to-r from-orange-400 to-orange-600",
  "bg-gradient-to-r from-red-400 to-red-600",
];

const Post: React.FC<PostProps> = ({ post, likedPosts, handleLike }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.imgs.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + post.imgs.length) % post.imgs.length
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
  });

  return (
    <div className="w-full p-2">
      <div
        className={`relative p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${
          urgencyGradients[post.urgency]
        }`}
      >
        <Link href={`/posts/${post.id}`}>
          <div className="absolute inset-0 rounded-lg bg-white opacity-60"></div>
        </Link>
        <div className="relative z-10">
          <div className="text-lg sm:text-xl font-semibold mb-2">
            {post.displayName}
          </div>
          {post.imgs.length > 0 && (
            <div className="relative mb-4" {...handlers}>
              <div className="relative w-full h-80 overflow-x-hidden rounded-lg bg-white">
                {post.imgs.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Post Image ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
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
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-gray-400"
                          }`}
                        ></span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="text-gray-800 text-sm sm:text-base line-clamp-3">
            {post.content}
          </div>
          <div className="text-gray-800">
            <div className="mt-4 flex justify-between items-center">
              <span className="text-teal-400 text-xs sm:text-sm">
                {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="flex text-gray-600 text-xs sm:text-sm">
                  {post.likes}
                </span>
                <button
                  className={`flex ${
                    likedPosts.includes(post.id)
                      ? "text-red-600"
                      : "text-gray-600"
                  } hover:text-red-700`}
                  onClick={() => handleLike(post)}
                >
                  {likedPosts.includes(post.id) ? (
                    <IoHeart />
                  ) : (
                    <IoHeartOutline />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
