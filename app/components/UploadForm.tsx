import React, { memo } from 'react';
import { Type, ImagePlus, Loader, Upload } from 'lucide-react';

interface UploadFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  isUploading: boolean;
  progress: number;
  error: string;
  disabled: boolean;
}

const UploadForm = memo(({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  isUploading,
  progress,
  error,
  disabled,
}: UploadFormProps) => (
  <div className="w-full md:w-[350px] p-6 space-y-6">
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Type size={20} />
        Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="input input-bordered w-full"
        placeholder="Write a title..."
      />
    </div>

    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <ImagePlus size={20} />
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="textarea textarea-bordered w-full h-32"
        placeholder="Write a description..."
      />
    </div>

    {progress > 0 && progress < 100 && (
      <div className="w-full bg-base-300 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}

    {error && (
      <div className="text-error text-sm p-2 bg-error/20 rounded-lg">
        {error}
      </div>
    )}

    <button
      onClick={onSubmit}
      disabled={disabled}
      className="btn btn-primary w-full"
    >
      {isUploading ? (
        <Loader className="animate-spin" size={20} />
      ) : (
        <>
          <Upload size={20} />
          Share
        </>
      )}
    </button>
  </div>
));

UploadForm.displayName = "UploadForm";

export default UploadForm;