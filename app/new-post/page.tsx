"use client";
import NewDeedForm from "@/components/NewDeedForm";
import { useState } from "react";
import { addPost } from "@/services/posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Post } from "@/types";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const [user] = useAuthState(auth);
  const [category, setCategory] = useState<string>("HELP_OTHERS");
  const [media, setMedia] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [urgency, setUrgency] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleMediaUpload = () => {
    console.log("Media upload button clicked");
    document.getElementById("media-upload")?.click();
  };

  const handleCameraClick = () => {
    console.log("Camera button clicked");
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result as string);
        console.log("Media uploaded:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // console.log("Category changed to:", newCategory);
  };

  const handleTermsAgree = () => {
    setTermsAgreed(true);
    // console.log("Terms and conditions agreed");
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrgency(Number(e.target.value));
    // console.log("Urgency level changed to:", e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // console.log("Content changed to:", e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    // console.log("Location changed to:", e.target.value);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("You need to be logged in to create a post.");
      console.error("User not authenticated");
      return;
    }

    const newPost: Post = {
      id: "", // Firestore will generate the ID
      userId: user.uid,
      displayName: user.displayName || "Anonymous",
      img: media,
      content,
      likes: 0,
      location,
      urgency,
      relatedToNeedy: category === "HELP_OTHERS",
      date: new Date(),
    };

    try {
      await addPost(newPost);
      console.log("Post added successfully:", newPost);
      // Reset form or navigate to another page
      router.push("/"); 
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <div className="mx-auto p-4">
      <NewDeedForm
        onMediaUpload={handleMediaUpload}
        onCameraClick={handleCameraClick}
        media={media}
        onMediaChange={handleMediaChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        onTermsAgree={handleTermsAgree}
        urgency={urgency}
        onUrgencyChange={handleUrgencyChange}
        content={content}
        onContentChange={handleContentChange}
        location={location}
        onLocationChange={handleLocationChange}
        onSubmit={handleSubmit}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleMediaChange}
        className="hidden"
        id="media-upload"
      />
    </div>
  );
}