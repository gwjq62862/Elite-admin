"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";

// Shared Components
import InputGroup from "@/app/components/InputGroup";
import Toast from "@/app/components/Toast";

// Constants for File Upload Validation
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE_MB = 10;

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elite-admin-production.up.railway.app";

// Form Data State Interface
interface PostData {
  youtubeUrl: string;
  title: string;
  caption: string;
}

interface Post {
  _id: string;
  title: string;
  caption: string;
  youtubeUrl: string;
  imageUrl: string;
  createdAt: string;
}

// Toast Status Type
type ToastType = {
  isVisible: boolean;
  content: string;
  color: "bg-green-500/90" | "bg-red-500/90";
};

export default function EditPostPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [formData, setFormData] = useState<PostData>({
    youtubeUrl: "",
    title: "",
    caption: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [toast, setToast] = useState<ToastType>({
    isVisible: false,
    content: "",
    color: "bg-green-500/90",
  });

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setToast({
          isVisible: true,
          content: "Post ID is missing",
          color: "bg-red-500/90",
        });
        setTimeout(() => router.push("/posts"), 2000);
        return;
      }

      // Validate postId format (MongoDB ObjectId should be 24 hex characters)
      if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
        console.error("Invalid post ID format:", postId);
        setToast({
          isVisible: true,
          content: "Invalid post ID format",
          color: "bg-red-500/90",
        });
        setTimeout(() => router.push("/posts"), 2000);
        return;
      }

      try {
        setIsFetching(true);
        const url = `${API_BASE_URL}/api/posts/${postId}`;
        console.log("Fetching post from:", url);

        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          let errorMessage = `Failed to fetch post: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("Post data received:", result);

        if (result.success && result.data) {
          const post = result.data;

          setFormData({
            youtubeUrl: post.youtubeUrl || "",
            title: post.title || "",
            caption: post.caption || "",
          });
          setExistingImageUrl(post.imageUrl || "");
        } else {
          throw new Error(result.message || "Post not found");
        }
      } catch (error: any) {
        console.error("Error fetching post:", error);
        setToast({
          isVisible: true,
          content:
            error.message ||
            "Failed to load post data. Please check if the backend server is running.",
          color: "bg-red-500/90",
        });
        setTimeout(() => router.push("/posts"), 3000);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id === "youtube-url"
        ? "youtubeUrl"
        : e.target.id === "post-title"
        ? "title"
        : "caption"]: e.target.value,
    });
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFile(null);
      closeToast();

      const file = event.target.files?.[0];

      if (!file) return;

      // 1. File Size Validation
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setToast({
          isVisible: true,
          content: `File size must not exceed ${MAX_FILE_SIZE_MB}MB`,
          color: "bg-red-500/90",
        });
        return;
      }

      // 2. File Type Validation (Images only: JPG, PNG, GIF)
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setToast({
          isVisible: true,
          content: "Only JPG, PNG, or GIF images are allowed for thumbnails",
          color: "bg-red-500/90",
        });
        return;
      }

      setSelectedFile(file);
    },
    []
  );

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    if (!formData.title || !formData.youtubeUrl) {
      setToast({
        isVisible: true,
        content: "Title and YouTube URL are required fields",
        color: "bg-red-500/90",
      });
      return;
    }

    setIsLoading(true);
    closeToast();

    const dataToSend = new FormData();

    dataToSend.append("youtubeUrl", formData.youtubeUrl);
    dataToSend.append("title", formData.title);
    dataToSend.append("caption", formData.caption);

    if (selectedFile) {
      dataToSend.append("thumbnail", selectedFile);
    }

    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "An error occurred while updating the post"
        );
      }

      setToast({
        isVisible: true,
        content: "Post updated successfully",
        color: "bg-green-500/90",
      });

      // Redirect to posts page after successful update
      setTimeout(() => {
        router.push("/posts");
      }, 1500);
    } catch (error: any) {
      console.error("Post Update Error:", error);
      setToast({
        isVisible: true,
        content:
          error.message || "Network connection issue or server error occurred",
        color: "bg-red-500/90",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isFetching) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-12 text-center text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading post data...</span>
        </div>
      </div>
    );
  }

  // Auth check
  if (!isSignedIn) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-12 text-center text-red-400">
        You must be signed in to edit a post.
      </div>
    );
  }

  // File Input UI Helper
  const fileInputId = "custom-thumbnail";

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-3xl">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Edit Post
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Update post information and thumbnail
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePost}>
          <div className="flex flex-col gap-8 bg-background-light dark:bg-[#1A1A1A] rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-white/10">
            {/* Field: YouTube URL */}
            <InputGroup
              label="YouTube Video URL (Required)"
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.youtubeUrl}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />

            {/* Field: Post Title */}
            <InputGroup
              label="Post Title (Required)"
              id="post-title"
              type="text"
              placeholder="Enter the title for your post"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />

            {/* Field: Caption (TextArea Version) */}
            <InputGroup
              label="Caption"
              id="caption"
              isTextArea={true}
              placeholder="Write a caption for your post..."
              value={formData.caption}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            {/* File Uploader Section */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                Custom Thumbnail
              </label>

              {/* Show existing thumbnail if no new file selected */}
              {!selectedFile && existingImageUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Current Thumbnail:
                  </p>
                  <div className="relative w-full max-w-md">
                    <img
                      src={existingImageUrl}
                      alt="Current thumbnail"
                      className="w-full h-auto rounded-lg border border-gray-200 dark:border-white/10"
                    />
                  </div>
                </div>
              )}

              <label
                htmlFor={fileInputId}
                className={`flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 
                                    ${
                                      selectedFile
                                        ? "border-indigo-500 bg-indigo-900/20"
                                        : "border-gray-600 dark:border-white/20 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-800/50 dark:bg-[#2C2C2E]"
                                    }
                                    ${
                                      isLoading
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                    }
                                `}
              >
                <input
                  id={fileInputId}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={ALLOWED_IMAGE_TYPES.join(", ")}
                  disabled={isLoading}
                />
                <div className="text-center">
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-green-500 !text-4xl">
                        check_circle
                      </span>
                      <p className="mt-2 text-sm text-white font-semibold truncate max-w-full">
                        {selectedFile.name}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                          closeToast();
                        }}
                        className="mt-1 text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 !text-4xl">
                        upload_file
                      </span>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-indigo-500">
                          Click to upload new thumbnail
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG, GIF up to {MAX_FILE_SIZE_MB}MB (Leave empty to
                        keep current)
                      </p>
                    </>
                  )}
                </div>
              </label>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload a new thumbnail to replace the current one, or leave
                empty to keep the existing thumbnail.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
              <button
                type="button"
                className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-sm font-bold leading-normal tracking-wide transition-colors hover:bg-gray-300 dark:hover:bg-white/20"
                onClick={() => router.push("/posts")}
                disabled={isLoading}
              >
                <span className="truncate">Cancel</span>
              </button>
              <button
                type="submit"
                className={`w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-white text-sm font-bold leading-normal tracking-wide transition-all duration-200 ${
                  isLoading
                    ? "bg-indigo-900 opacity-70 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  <span className="truncate">Update Post</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Toast for Feedback */}
      <Toast
        content={toast.content}
        color={toast.color}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
