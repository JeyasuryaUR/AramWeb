"use client";
import PostsGrid from "@/components/PostsGrid";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { postCategories } from "@/lib/constants";
import { fetchPosts } from "@/services/posts";
import { Post } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    };
    loadPosts();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="text-center mt-4">
        <FloatingNav navItems={postCategories} />
      </div>
      <PostsGrid posts={posts} />
    </div>
  );
}
