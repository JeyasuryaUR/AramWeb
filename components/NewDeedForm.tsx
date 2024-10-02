import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { TbReplaceFilled } from "react-icons/tb";

interface NewDeedFormProps {
  onMediaUpload: () => void;
  onCameraClick: () => void;
  media: string | undefined;
  onMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  onTermsAgree: () => void;
  urgency: number;
  onUrgencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  location: string;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
}

const NewDeedForm: React.FC<NewDeedFormProps> = ({
  onMediaUpload,
  onCameraClick,
  media,
  onMediaChange,
  category,
  onCategoryChange,
  onTermsAgree,
  urgency,
  onUrgencyChange,
  content,
  onContentChange,
  location,
  onLocationChange,
  onSubmit,
}) => {
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleOrganizerChange = () => {
    setIsOrganizer(!isOrganizer);
  };

  const handleTermsChange = () => {
    setTermsAgreed(!termsAgreed);
    onTermsAgree();
  };

  return (
    <main className="flex flex-col w-full max-w-md mx-auto p-6 text-xl rounded-3xl bg-white shadow-lg">
      <div className="flex items-center justify-center mb-4">
        {media ? (
          <div className="relative">
            <img
              src={media}
              alt="Uploaded media"
              className="w-32 h-32 rounded-xs"
            />
            <button
              onClick={onMediaUpload}
              className="absolute top-0 -right-3 p-1 bg-white rounded-full shadow-md"
            >
              <TbReplaceFilled className="text-secondary" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onMediaUpload}
              className="px-4 py-2 text-white bg-secondary rounded-full hover:bg-secondary"
            >
              Add Media
            </button>
            <label className="ml-2 cursor-pointer">
              <FaCamera
                className="text-secondary text-2xl"
                onClick={onCameraClick}
              />
            </label>
          </>
        )}
      </div>
      <textarea
        className="w-full p-4 mb-4 text-black bg-transparent border-2 rounded-md resize-none placeholder-gray-500 focus:outline-none"
        placeholder="Describe Your Deed"
        rows={4}
        value={content}
        onChange={onContentChange}
      />
      <div className="flex flex-col text-sm">
        <div className="mb-4 flex items-center justify-between  gap-2">
          <label className="flex leading-4 text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={onLocationChange}
            className="w-full p-2 text-black bg-transparent border border-gray-300 rounded-md focus:outline-none"
            placeholder="Enter location"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <label className="block mb-2 leading-4 text-gray-700">
            Urgency
          </label>
          <div className="flex flex-col w-full">
            <input
              type="range"
              min="0"
              max="2"
              value={urgency}
              onChange={onUrgencyChange}
              className="w-full"
            />
            <div className="flex w-full justify-between text-xs">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mb-4 text-xs tracking-wide leading-none">
        <div className="flex gap-2.5 justify-center items-center py-1.5 px-2 bg-gray-200 rounded-full">
          <button
            onClick={() => onCategoryChange("HELP_OTHERS")}
            className={`px-4 py-2 font-bold uppercase rounded-full ${
              category === "HELP_OTHERS"
                ? "bg-secondary text-white"
                : "text-gray-700"
            }`}
          >
            Help Others
          </button>
          <button
            onClick={() => onCategoryChange("SELF_HELP")}
            className={`px-4 py-2 font-bold uppercase rounded-full ${
              category === "SELF_HELP"
                ? "bg-secondary text-white"
                : "text-gray-700"
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
        <label className="text-sm leading-4 text-gray-700">
          Related to the needy.
        </label>
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
          <button
            onClick={onTermsAgree}
            className="text-blue-500 underline focus:outline-none"
          >
            Terms and Conditions
          </button>
        </label>
      </div>
      <button
        type="submit"
        className="self-center px-6 py-2 text-white bg-secondary rounded-full hover:bg-secondary"
        onClick={onSubmit}
      >
        Submit
      </button>
    </main>
  );
};

export default NewDeedForm;