import React, { useState, useEffect } from "react";
import { Post as PostType } from "@/types";
import { FloatingNav } from "./ui/floating-navbar";
import { FaHeartbeat, FaPaw, FaUtensils, FaHandsHelping, FaMedkit } from "react-icons/fa";
import { updatePostLikes } from "@/services/posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Post from "@/components/PostComponent";

interface PostsGridProps {
  posts: PostType[];
}

const navItems = [
  { name: "General Help", link: "/category/general-help", icon: <FaHandsHelping /> },
  { name: "Medical Aid", link: "/category/medical-aid", icon: <FaMedkit /> },
  { name: "Blood Donation", link: "/category/blood-donation", icon: <FaHeartbeat /> },
  { name: "Animal Rescue", link: "/category/animal-rescue", icon: <FaPaw /> },
  { name: "Food Assistance", link: "/category/food-assistance", icon: <FaUtensils /> },
  { name: "Student Welfare", link: "/category/medical-aid", icon: <FaMedkit /> },
];

const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  const [user] = useAuthState(auth);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const userLikedPosts = posts
        .filter((post) => (post.likedBy || []).includes(user.uid))
        .map((post) => post.id);
      setLikedPosts(userLikedPosts);
    }
  }, [user, posts]);

  const handleLike = async (postId: string) => {
    if (!user) {
      alert("You need to be logged in to like a post.");
      return;
    }

    const isLiked = likedPosts.includes(postId);

    await updatePostLikes(postId, user.uid, !isLiked);

    setLikedPosts((prevLikedPosts) =>
      isLiked ? prevLikedPosts.filter((id) => id !== postId) : [...prevLikedPosts, postId]
    );
  };

  return (
    <section className="py-2 relative " id="posts">
      <div className="container mx-auto">
        <div className="text-center mb-4">
          <FloatingNav navItems={navItems} />
        </div>
        <div className="flex flex-wrap -mx-4">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              likedPosts={likedPosts}
              handleLike={handleLike}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostsGrid;