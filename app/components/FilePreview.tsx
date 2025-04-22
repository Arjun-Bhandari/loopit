import React,{memo} from "react";
import {X} from "lucide-react"
const FilePreview = memo(
  ({
    preview,
    fileType,
    onClear,
  }: {
    preview: string | null;
    fileType?: string;
    onClear: () => void;
  }) => {
    if (!preview) return null;

    return (
      <div className="relative w-full h-[400px]">
        {fileType?.startsWith("video/") ? (
          <video
            src={preview}
            className="w-full h-full object-contain"
            controls
          />
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        )}
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1 bg-base-300 rounded-full hover:bg-base-100"
        >
          <X size={20} />
        </button>
      </div>
    );
  }
);

FilePreview.displayName = "FilePreview";

export default FilePreview;