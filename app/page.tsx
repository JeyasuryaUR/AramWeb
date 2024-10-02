"use client";
import PostsGrid from "@/components/PostsGrid";
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
    <div>
      <PostsGrid posts={posts} />
    </div>
  );
}