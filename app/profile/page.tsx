"use client";

import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { getUserPosts, updatePostLikes } from "@/services/posts";
import { Post as PostType } from "@/types";
import { FaHeart, FaUserFriends, FaPen, FaUserCircle } from "react-icons/fa";
import Post from "@/components/PostComponent"; // Adjust the import path as necessary
import PostsGrid from "@/components/PostsGrid";

export default function Profile() {
  const [user] = useAuthState(auth);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (user) {
      const userLikedPosts = userPosts
        .filter((post) => (post.likedBy || []).includes(user.uid))
        .map((post) => post.id);
    }
  }, [user, userPosts]);

  useEffect(() => {
    if (user) {
      const fetchUserPosts = async () => {
        const posts = await getUserPosts(user.uid);
        setUserPosts(posts);
      };
      fetchUserPosts();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 flex flex-col items-center justify-center max-w-4xl min-h-screen">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full ">
        {user.photoURL ? (
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img
              src={user.photoURL}
              alt="User Profile"
              className="rounded-full"
            />
          </div>
        ) : (
          <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
        )}
        <h1 className="text-3xl font-bold mb-2">{user.displayName || "User"}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      {/* User Stats */}
      <div className="flex justify-around w-full gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg shadow-lg text-center w-1/3">
          <FaHeart className="text-red-500 text-2xl mx-auto mb-2" />
          <h3 className="text-xl font-bold">Posts</h3>
          <p className="text-gray-600">{userPosts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg text-center w-1/3">
          <FaUserFriends className="text-blue-500 text-2xl mx-auto mb-2" />
          <h3 className="text-xl font-bold">Followers</h3>
          <p className="text-gray-600">128</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg text-center w-1/3">
          <FaPen className="text-green-500 text-2xl mx-auto mb-2" />
          <h3 className="text-xl font-bold">Following</h3>
          <p className="text-gray-600">89</p>
        </div>
      </div>

      {/* User Bio */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full mt-4">
        <h2 className="text-2xl font-bold mb-4">About Me</h2>
        <p className="text-gray-600">
          Hi, I'm {user.displayName || "User"}. I love helping people and making a difference in the community. Join me on this journey to make the world a better place!
        </p>
      </div>

      {/* My Deeds */}
      <div className="container pt-6 flex flex-col justify-center items-center  w-full mt-4">
        <h2 className="text-2xl font-bold mb-4">My Deeds</h2>
        <PostsGrid posts={userPosts} />
      </div>
    </div>
  );
}