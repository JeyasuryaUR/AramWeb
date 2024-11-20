"use client";
import React, { useState, useEffect } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import { FileUpload } from "./ui/file-upload";
import { compressAndUploadImage } from "@/services/posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

interface NewDeedFormProps {
  category: string;
  onCategoryChange: (category: string) => void;
  onTermsAgree: () => void;
  urgency: number;
  onUrgencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (params: {
    user: any;
    selectedFiles: File[];
    category: string;
    urgency: number;
    content: string;
    location: [number, number];
    landmark: string;
  }) => Promise<void>;
  onMediaChange: (media: string[]) => void;
}

const NewDeedForm: React.FC<NewDeedFormProps> = ({
  category,
  onCategoryChange,
  onTermsAgree,
  urgency,
  onUrgencyChange,
  content,
  onContentChange,
  onSubmit,
  onMediaChange,
}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  // console.log("LOCATIONIQ_API_KEY:", LOCATIONIQ_API_KEY);

  const [isOrganizer, setIsOrganizer] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [landmark, setLandmark] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);

          // Use LocationIQ API to convert latitude and longitude to an address
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
            console.log("Address:", data.display_name);
          } else {
            setLocation("Unable to retrieve address");
          }
        },
        (error) => {
          alert("Location permission needed");
          router.push("/");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      router.push("/");
    }
  }, [router, LOCATIONIQ_API_KEY]);

  const handleOrganizerChange = () => setIsOrganizer(!isOrganizer);

  const handleTermsChange = () => {
    setTermsAgreed(!termsAgreed);
    onTermsAgree();
  };

  const handleFileChange = (files: File[]) => setSelectedFiles(files.slice(0, 3));

  const handleRemoveImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleFormSubmit = async () => {
    if (!user) {
      alert("You need to be logged in to create a post.");
      console.error("User not authenticated");
      return;
    }

    if (latitude === null || longitude === null) {
      alert("Unable to retrieve location coordinates.");
      return;
    }

    await onSubmit({
      user,
      selectedFiles,
      category,
      urgency,
      content,
      location: [latitude, longitude],
      landmark,
    });
  };

  return (
    <main className="flex flex-col w-full max-w-screen-md mx-auto p-6 text-xl rounded-3xl bg-white shadow-lg">
      <div className="flex items-center justify-center">
        <FileUpload
          onChange={(files) => handleFileChange(Array.from(files))}
          disabled={selectedFiles.length >= 3}
        />
      </div>
      <div className="flex justify-center items-center mb-4 text-xs tracking-wide leading-none">
        <span>{selectedFiles.length}/3</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="relative w-32 h-32">
            <img
              src={URL.createObjectURL(file)}
              alt={`Selected ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
            <button
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
              onClick={() => handleRemoveImage(index)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      <textarea
        className="w-full p-4 mb-4 text-black bg-transparent border-2 rounded-md resize-none placeholder-gray-500 focus:outline-none"
        placeholder="Describe Your Deed"
        rows={4}
        value={content}
        onChange={onContentChange}
      />
      <div className="flex flex-col text-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <label className="flex leading-4 text-gray-700">Location</label>
          <textarea
            value={location}
            disabled
            className="w-full p-2 text-black bg-gray-200 border border-gray-300 rounded-md focus:outline-none resize-none"
            placeholder="Retrieving location..."
            rows={Math.max(3, location.split("\n").length)}
          />
        </div>
        {latitude && longitude && (
          <div className="mb-4">
            <label className="flex leading-4 text-gray-700 mb-2">Map</label>
            <div className="w-full h-64">
              <MapComponent latitude={latitude} longitude={longitude} />
            </div>
          </div>
        )}
        <div className="mb-4 flex items-center justify-between gap-2">
          <label className="flex leading-4 text-gray-700">Landmark</label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full p-2 text-black bg-transparent border border-gray-300 rounded-md focus:outline-none"
            placeholder="Enter landmark"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <label className="block mb-2 leading-4 text-gray-700">Urgency</label>
          <input
            type="range"
            min="0"
            max="10"
            value={urgency}
            onChange={onUrgencyChange}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-center items-center mb-4 text-xs tracking-wide leading-none">
        <div className="flex gap-2.5 justify-center items-center py-1.5 px-2 bg-gray-200 rounded-full">
          <button
            onClick={() => onCategoryChange("HELP_OTHERS")}
            className={`px-4 py-2 font-bold uppercase rounded-full ${
              category === "HELP_OTHERS" ? "bg-secondary text-white" : "text-gray-700"
            }`}
          >
            Help Others
          </button>
          <button
            onClick={() => onCategoryChange("SELF_HELP")}
            className={`px-4 py-2 font-bold uppercase rounded-full ${
              category === "SELF_HELP" ? "bg-secondary text-white" : "text-gray-700"
            }`}
          >
            Self Help
          </button>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isOrganizer}
          onChange={handleOrganizerChange}
          className="mr-2"
        />
        <label className="text-sm leading-4 text-gray-700">Related to the needy.</label>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={termsAgreed}
          onChange={handleTermsChange}
          className="mr-2"
        />
        <label className="text-sm leading-none text-gray-700">
          Agree to{" "}
          <button onClick={onTermsAgree} className="text-blue-500 underline focus:outline-none">
            Terms and Conditions
          </button>
        </label>
      </div>
      <button
        type="submit"
        className="self-center px-6 py-2 text-white bg-secondary rounded-full hover:bg-secondary"
        onClick={handleFormSubmit}
      >
        Submit
      </button>
    </main>
  );
};

export default NewDeedForm;