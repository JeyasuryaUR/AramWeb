"use client";
import NewDeedForm from "@/components/NewDeedForm";
import { useState } from "react";
import { addPost, compressAndUploadImage } from "@/services/posts";
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

const NewPost = () => {
  const [user] = useAuthState(auth);
  const [category, setCategory] = useState<string>("GH");
  const [media, setMedia] = useState<string[]>([]);
  const router = useRouter();
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [urgency, setUrgency] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [landmark, setLandmark] = useState<string>("");

  const handleCategoryChange = (newCategory: string) => setCategory(newCategory);

  const handleTermsAgree = () => setTermsAgreed(true);

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => setUrgency(Number(e.target.value));

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const newCategory = categorizePost(e.target.value);
    setCategory(newCategory);
  };

  const handleMediaChange = (media: string[]) => setMedia(media);

  const handleSubmit = async ({
    user,
    selectedFiles,
    category,
    urgency,
    content,
    location,
    landmark,
  }: {
    user: any;
    selectedFiles: File[];
    category: string;
    urgency: number;
    content: string;
    location: [number, number];
    landmark: string;
  }) => {
    const fullName = user.displayName || "anonymous";
    const uploadPromises = selectedFiles.map((file, index) =>
      compressAndUploadImage(file, fullName, (index + 1).toString())
    );

    try {
      const imageUrls = await Promise.all(uploadPromises);
      setMedia(imageUrls);

      const newPost: Post = {
        id: "", // Firestore will generate the ID
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
        imgs: imageUrls,
        content,
        likes: 0,
        location,
        landmark,
        urgency,
        relatedToNeedy: category === "GH",
        date: new Date(),
      };

      const docRef = await addPost(newPost);
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
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default NewPost;