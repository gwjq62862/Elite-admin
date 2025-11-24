import Link from "next/link";

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elite-admin-production.up.railway.app";

interface Post {
  _id: string;
  title: string;
  caption: string;
  youtubeUrl: string;
  imageUrl: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Post[];
  metadata?: {
    totalPosts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

async function fetchRecentPosts(): Promise<Post[]> {
  try {
    const url = `${API_BASE_URL}/api/posts?page=1&limit=5&sort=${encodeURIComponent(
      '{"createdAt":-1}'
    )}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error(`API Error: ${res.status}`);
      return [];
    }

    const result: ApiResponse = await res.json();
    return result.success ? result.data : [];
  } catch (err) {
    console.error("Fetch Error:", err);
    return [];
  }
}

async function fetchTotalPosts(): Promise<number> {
  try {
    const url = `${API_BASE_URL}/api/posts?page=1&limit=1`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return 0;
    }

    const result: ApiResponse = await res.json();
    return result.metadata?.totalPosts || 0;
  } catch (err) {
    console.error("Fetch Error:", err);
    return 0;
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

export default async function Dashboard() {
  const [recentPosts, totalPosts] = await Promise.all([
    fetchRecentPosts(),
    fetchTotalPosts(),
  ]);

  return (
    <>
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        {/* PageHeading */}
        <div className="mb-6">
          <h1 className="text-gray-900 dark:text-[#E0E0E0] text-3xl font-black leading-tight tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-[#A0A0A0] text-base font-normal leading-normal mt-1">
            An overview of the system's status and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-gray-100 dark:bg-[#1E1E1E] border border-transparent dark:border-white/10">
            <p className="text-gray-600 dark:text-[#A0A0A0] text-base font-medium leading-normal">
              Total Posts
            </p>
            <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
              {totalPosts.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-gray-100 dark:bg-[#1E1E1E] border border-transparent dark:border-white/10">
            <p className="text-gray-600 dark:text-[#A0A0A0] text-base font-medium leading-normal">
              Recent Posts
            </p>
            <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
              {recentPosts.length}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-gray-100 dark:bg-[#1E1E1E] border border-transparent dark:border-white/10">
            <p className="text-gray-600 dark:text-[#A0A0A0] text-base font-medium leading-normal">
              Active
            </p>
            <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
              {totalPosts > 0 ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-gray-100 dark:bg-[#1E1E1E] border border-transparent dark:border-white/10">
            <p className="text-gray-600 dark:text-[#A0A0A0] text-base font-medium leading-normal">
              System Status
            </p>
            <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
              Online
            </p>
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-[#1E1E1E] rounded-xl p-6 border border-transparent dark:border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Posts
            </h2>
            <Link
              href="/posts"
              className="text-sm text-primary hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No posts available.{" "}
                  <Link
                    href="/posts/create"
                    className="text-primary hover:underline"
                  >
                    Create your first post
                  </Link>
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="border-b border-gray-300 dark:border-white/20">
                  <tr>
                    {["Thumbnail", "Title", "Date Added", "Actions"].map(
                      (head, i) => (
                        <th
                          key={i}
                          className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#A0A0A0] ${
                            head === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {recentPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-gray-200 dark:hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div
                          className="w-24 h-14 bg-cover bg-center rounded-md"
                          style={{
                            backgroundImage: `url('${post.imageUrl}')`,
                          }}
                        ></div>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {post.title}
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/posts/edit/${post._id}`}
                          className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mr-1 inline-block"
                          title="Edit post"
                        >
                          <span className="material-symbols-outlined text-xl">
                            edit
                          </span>
                        </Link>
                        <Link
                          href="/posts"
                          className="p-1 text-gray-500 dark:text-gray-400 hover:text-primary inline-block"
                          title="View all posts"
                        >
                          <span className="material-symbols-outlined text-xl">
                            visibility
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
