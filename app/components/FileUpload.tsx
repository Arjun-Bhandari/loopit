"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState, memo, useEffect } from "react";
import { ImagePlus, Type, FileVideo, X, Upload, Loader } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import UploadForm from "./UploadForm"
import FilePreview from "./FilePreview";


// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const UploadExample = () => {
  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const [error, setError] = useState("");
  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/imagekit-auth");
      console.log("Response :", response);
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      console.log("DATA:", data);
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };
  const validateFile = (file: File) => {
    if (file.type === "video/mp4") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video File");
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("Vidoe must be 100 Mb");
      return false;
    } else {
      const validType = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
      if (!validType.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, WEBP,mp4)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be 5 Mb");
        return false;
      }
    }
    return false;
  };
  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };
  let thumbnailUrl =
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  const handleUPloadPost = async (vidUrl: string | undefined) => {
    if(!vidUrl){
      throw new Error("Video URL is required")
    }
    const videoData = {
      title,
      description,
      videoUrl: vidUrl,
      thumbnailUrl,
    };
    try {
      await apiClient.createVideo(videoData);
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    // Use selectedFile directly instead of accessing through ref
    const file = selectedFile;
    await validateFile(file);

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        folder: file.type === "video/mp4" ? "/loopit_video" : "/loopit_image",
        fileName: file.type === "video/mp4" ? "Video" : "Image", // Optionally set a custom file name
        useUniqueFileName: true,
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      console.log(uploadResponse.url);
      const mongoRes = await handleUPloadPost(uploadResponse?.url);
      console.log(mongoRes);
      router.push("/");
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      const file = files[0];
      if (file.type.startsWith("video/") || file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setError("Please upload only images or videos");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="  bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-base-200 rounded-lg  w-full shadow-xl">
        <div className="border-b border-base-300 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create new post</h2>
        </div>

        <div className="flex flex-col md:flex-row min-h-[500px]">
          <div className="flex-1 border-r border-base-300">
            <div
              className={`h-full flex items-center justify-center
                ${!preview ? "border-2 border-dashed rounded-lg" : ""}
                ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-base-300"
                }
                transition-colors duration-200`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {preview ? (
                <FilePreview
                  preview={preview}
                  fileType={selectedFile?.type}
                  onClear={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                />
              ) : (
                <div className="text-center space-y-4 ">
                  <div className="p-4 rounded-full bg-base-300 inline-block">
                    <FileVideo size={48} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">
                    {isDragging
                      ? "Drop to upload"
                      : "Drag photos and videos here"}
                  </h3>
                  <label className="btn btn-primary">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                    />
                    Select from computer
                  </label>
                </div>
              )}
            </div>
          </div>

          <UploadForm
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onSubmit={handleUpload}
            isUploading={progress > 0}
            progress={progress}
            error={error}
            disabled={!preview || progress > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(UploadExample);
