import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone, Accept } from "react-dropzone";
import { FaTimes } from "react-icons/fa";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 8,
    y: -8,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  disabled,
}: {
  onChange?: (files: File[]) => void;
  disabled?: boolean;
}) => {
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const updatedImages = [...images, ...newFiles].slice(0, 3);
    setImages(updatedImages);
    onChange && onChange(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange && onChange(updatedImages);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    accept: { "image/*": [] } as Accept,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={`p-10 group/image block rounded-lg cursor-pointer w-full relative overflow-hidden `}
      >
        <input
          ref={fileInputRef}
          id="image-upload-handle"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          disabled={disabled}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            {images.length > 0 ? "Add image" : "Upload image"}
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your images here or click to upload
          </p>
          <div className="relative w-full mt-2 max-w-xl mx-auto flex justify-center items-center gap-4">
            {images.length > 0 &&
              images.map((image, idx) => (
                <motion.div
                  key={"image" + idx}
                  layoutId={idx === 0 ? "image-upload" : "image-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start w-32 h-32 md:w-48 md:h-48 p-4 mt-4 rounded-md",
                    "shadow-sm"
                  )}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <FaTimes />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {(image.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {image.type}
                  </div>
                </motion.div>
              ))}
            {images.length === 0 && (
              <motion.div
                layoutId="image-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/image:shadow-xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 w-32 mt-4 rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300 z-30" />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}