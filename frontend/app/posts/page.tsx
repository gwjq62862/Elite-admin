// app/posts/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Toast from "@/app/components/Toast";

// ---------------------------------------------
// Types (matching your backend response)
// ---------------------------------------------
interface Post {
  _id: string;
  title: string;
  caption: string;
  youtubeUrl: string;
  imageUrl: string;
  createdAt: string;
}

interface Metadata {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Post[];
  metadata: Metadata;
}

// Toast Status Type
type ToastType = {
  isVisible: boolean;
  content: string;
  color: "bg-green-500/90" | "bg-red-500/90";
};

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elite-admin-production.up.railway.app";

// ---------------------------------------------
// Fetch Posts from your REAL backend
// ---------------------------------------------
async function fetchPosts(
  page: number,
  limit: number,
  sort: string,
  search?: string
): Promise<ApiResponse> {
  const encodedSort = encodeURIComponent(sort);
  const searchParam =
    search && search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
  const url = `${API_BASE_URL}/api/posts?page=${page}&limit=${limit}&sort=${encodedSort}${searchParam}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("Fetch Error:", err);

    return {
      success: false,
      message: "Failed to connect to backend",
      data: [],
      metadata: {
        totalPosts: 0,
        totalPages: 0,
        currentPage: page,
        limit,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
      },
    };
  }
}

// ---------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------
export default function ManagePostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken } = useAuth();

  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const sort = searchParams.get("sort") ?? '{"createdAt":-1}';
  const urlSearch = searchParams.get("search") ?? "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({
    totalPosts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });
  const [success, setSuccess] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [toast, setToast] = useState<ToastType>({
    isVisible: false,
    content: "",
    color: "bg-green-500/90",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync search input with URL params (for browser back/forward navigation)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Fetch posts when dependencies change
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const result = await fetchPosts(page, limit, sort, urlSearch);
      setPosts(result.data);
      setMetadata(result.metadata);
      setSuccess(result.success);
      setIsLoading(false);
    };

    loadPosts();
  }, [page, limit, sort, urlSearch]);

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedSearch = searchInput.trim();
      if (trimmedSearch !== urlSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        } else {
          params.delete("search");
        }
        params.set("page", "1"); // Reset to first page on search
        router.push(`/posts?${params.toString()}`);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, router, searchParams]);

  // Handle delete post
  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (
        !confirm(
          "Are you sure you want to delete this post? This action cannot be undone."
        )
      ) {
        return;
      }

      setDeletingId(postId);
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete post");
        }

        setToast({
          isVisible: true,
          content: "Post deleted successfully",
          color: "bg-green-500/90",
        });

        // Refresh posts list
        const result = await fetchPosts(page, limit, sort, urlSearch);
        setPosts(result.data);
        setMetadata(result.metadata);
        setSuccess(result.success);
      } catch (error: any) {
        console.error("Delete Error:", error);
        setToast({
          isVisible: true,
          content: error.message || "Failed to delete post. Please try again.",
          color: "bg-red-500/90",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [getToken, page, limit, sort, urlSearch]
  );

  const currentPage = metadata.currentPage;
  const totalPages = metadata.totalPages;

  // Pagination page numbers
  const pageNumbers: (number | "...")[] = [];
  const maxDisplay = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxDisplay / 2));
  let endPage = Math.min(totalPages, startPage + maxDisplay - 1);

  if (endPage - startPage + 1 < maxDisplay) {
    startPage = Math.max(1, endPage - maxDisplay + 1);
  }

  if (startPage > 1) {
    pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push("...");
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  // Build pagination URLs
  const createPageLink = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", p.toString());
      params.set("limit", limit.toString());
      params.set("sort", sort);
      if (urlSearch) {
        params.set("search", urlSearch);
      }
      return `/posts?${params.toString()}`;
    },
    [searchParams, limit, sort, urlSearch]
  );

  return (
    <main className="flex-1 px-6 pt-6 md:px-8 lg:px-10 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            Manage Posts
          </h1>
          <p className="text-muted-light dark:text-muted-dark">
            Add, edit, or delete video posts.
          </p>
        </div>

        <Link
          href="/posts/create"
          className="flex items-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition shadow-md"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Post
        </Link>
      </header>

      {/* Search bar */}
      <div className="mb-6">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full items-stretch h-full shadow-sm rounded-lg">
            <div className="flex items-center px-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-l-lg text-muted-light dark:text-muted-dark">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title or caption..."
              className="rounded-r-lg px-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </label>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 text-center bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark">
          <p className="font-bold text-gray-900 dark:text-white">
            Loading posts...
          </p>
        </div>
      )}

      {/* Error message */}
      {!isLoading && !success && posts.length === 0 && (
        <div className="p-8 text-center bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 shadow-md">
          <p className="font-bold">Error loading posts</p>
          <p className="text-sm">Backend may be offline or unreachable.</p>
        </div>
      )}

      {/* No posts */}
      {!isLoading && success && posts.length === 0 && (
        <div className="p-8 text-center bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark">
          <p className="font-bold text-gray-900 dark:text-white">
            {urlSearch
              ? "No posts found matching your search"
              : "No Posts Available"}
          </p>
          <p className="text-sm text-muted-light dark:text-muted-dark mt-2">
            {urlSearch
              ? "Try adjusting your search terms."
              : 'Click "Add New Post" to create your first post.'}
          </p>
        </div>
      )}

      {/* Posts Table */}
      {posts.length > 0 && (
        <div className="w-full overflow-x-auto shadow-xl rounded-lg">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-surface-light dark:bg-surface-dark">
              <tr>
                <th className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  Thumbnail
                </th>
                <th className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  Title
                </th>
                <th className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  Caption
                </th>
                <th className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  YouTube URL
                </th>
                <th className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-t border-border-light dark:border-border-dark hover:bg-background-light/30 dark:hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div
                      className="w-24 h-14 bg-cover bg-center rounded shadow-sm"
                      style={{ backgroundImage: `url("${post.imageUrl}")` }}
                    ></div>
                  </td>

                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                    {post.title}
                  </td>

                  <td className="px-4 py-3 text-muted-light dark:text-muted-dark">
                    {post.caption}
                  </td>

                  <td className="px-4 py-3">
                    <a
                      href={post.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {post.youtubeUrl}
                    </a>
                  </td>

                  <td className="px-4 py-3 flex gap-4">
                    <Link
                      href={`/posts/edit/${post._id}`}
                      className="hover:text-blue-500 transition-colors"
                      title="Edit post"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>

                    <button
                      onClick={() => handleDeletePost(post._id)}
                      disabled={deletingId === post._id}
                      className={`hover:text-red-500 transition-colors ${
                        deletingId === post._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title="Delete post"
                    >
                      <span className="material-symbols-outlined">
                        {deletingId === post._id ? "hourglass_empty" : "delete"}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-light dark:text-muted-dark">
            Page {currentPage} of {totalPages} — {metadata.totalPosts} total
            posts
          </p>

          <nav className="flex items-center gap-2">
            {/* Prev */}
            <Link
              href={
                metadata.hasPrevPage ? createPageLink(currentPage - 1) : "#"
              }
              className={`flex items-center justify-center size-10 rounded-lg ${
                metadata.hasPrevPage
                  ? "hover:bg-primary/20"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </Link>

            {/* Page Numbers */}
            {pageNumbers.map((n, i) =>
              n === "..." ? (
                <span
                  key={i}
                  className="size-10 flex items-center justify-center"
                >
                  ...
                </span>
              ) : (
                <Link
                  key={i}
                  href={createPageLink(n)}
                  className={`size-10 flex items-center justify-center rounded-lg text-sm font-bold ${
                    n === currentPage
                      ? "bg-primary text-white"
                      : "hover:bg-primary/20 text-gray-900 dark:text-gray-200"
                  }`}
                >
                  {n}
                </Link>
              )
            )}

            {/* Next */}
            <Link
              href={
                metadata.hasNextPage ? createPageLink(currentPage + 1) : "#"
              }
              className={`flex items-center justify-center size-10 rounded-lg ${
                metadata.hasNextPage
                  ? "hover:bg-primary/20"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          isVisible={toast.isVisible}
          content={toast.content}
          color={toast.color}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      )}
    </main>
  );
}
