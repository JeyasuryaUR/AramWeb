import React, { useState, useEffect } from "react";
import { Post as PostType } from "@/types";
import { updatePostLikes } from "@/services/posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Post from "@/components/PostComponent";
import Link from "next/link";
import StackGrid from "react-stack-grid";

interface PostsGridProps {
  posts: PostType[];
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  const [user] = useAuthState(auth);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [columnWidth, setColumnWidth] = useState<string | number>('33.33%');

  useEffect(() => {
    if (user) {
      const userLikedPosts = posts
        .filter((post) => (post.likedBy || []).includes(user.uid))
        .map((post) => post.id);
      setLikedPosts(userLikedPosts);
    }
  }, [user, posts]);

  useEffect(() => {
    const updateColumnWidth = () => {
      if (window.innerWidth < 640) {
        setColumnWidth('100%');
      } else if (window.innerWidth < 1024) {
        setColumnWidth('50%');
      } else {
        setColumnWidth('33.33%');
      }
    };

    updateColumnWidth();
    window.addEventListener('resize', updateColumnWidth);

    return () => window.removeEventListener('resize', updateColumnWidth);
  }, []);

  const handleLike = async (post: PostType) => {
    if (!user) {
      alert("You need to be logged in to like a post.");
      return;
    }

    const isLiked = likedPosts.includes(post.id);

    post.likes += isLiked ? -1 : 1;
    await updatePostLikes(post.id, user.uid, !isLiked); 

    setLikedPosts((prevLikedPosts) =>
      isLiked ? prevLikedPosts.filter((id) => id !== post.id) : [...prevLikedPosts, post.id]
    );
  };

  return (
    <section className="py-2 relative w-full" id="posts">
      <StackGrid
        columnWidth={columnWidth}
        gutterWidth={16}
        gutterHeight={16}
        className="z-0"
        monitorImagesLoaded
      >
        {posts.map((post) => (
          
          <Post post={post} likedPosts={likedPosts} handleLike={handleLike} key={post.id}/>

          // <Link href={`/posts/${post.id}`} key={post.id}>
          //   <Post post={post} likedPosts={likedPosts} handleLike={handleLike} />
          // </Link>
        ))}
      </StackGrid>
    </section>
  );
};

export default PostsGrid;