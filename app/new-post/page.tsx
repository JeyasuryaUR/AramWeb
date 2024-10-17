"use client";
import NewDeedForm from "@/components/NewDeedForm";
import { useState } from "react";
import { addPost } from "@/services/posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Post } from "@/types";
import { useRouter } from "next/navigation";

const categorizePost = (description: string): string => {
  const keywords = {
    GH: ["help", "assist", "support"],
    MA: ["medical", "health", "doctor", "hospital"],
    BD: ["blood", "donation", "donate"],
    AA: ["animal", "pet", "rescue"],
    FA: ["food", "meal", "hunger"],
    SW: ["student", "education", "school", "college"],
  };

  for (const [category, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (description.toLowerCase().includes(word)) {
        return category;
      }
    }
  }

  return "GH"; // Default to General Help
};

export default function NewPost() {
  const [user] = useAuthState(auth);
  const [category, setCategory] = useState<string>("GH");
  const [media, setMedia] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [urgency, setUrgency] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleTermsAgree = () => {
    setTermsAgreed(true);
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrgency(Number(e.target.value));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const newCategory = categorizePost(e.target.value);
    setCategory(newCategory);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleMediaChange = (media: string) => {
    setMedia(media);
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
      relatedToNeedy: category === "GH",
      date: new Date(),
    };

    try {
      await addPost(newPost);
      console.log("Post added successfully:", newPost);
      router.push("/");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <div className="mx-auto p-4">
      <NewDeedForm
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
    </div>
  );
}