import React from 'react'; // React import is still necessary for JSX and types

// -------------------------------------------------------------
// Type Definitions (Backend API response structure)
// -------------------------------------------------------------
interface Post {
    _id: string; // MongoDB ID for key
    title: string;
    caption: string;
    youtubeUrl: string;
    // Backend controller uses 'imageUrl' (ImageKit URL)
    imageUrl: string; 
    createdAt: string;
    // Author ID, etc.
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

// -------------------------------------------------------------
// Data Fetching Function (Server Component)
// -------------------------------------------------------------
async function fetchPosts(searchParams: { [key: string]: string | string[] | undefined }): Promise<ApiResponse> {
    
    // Default values ကို သတ်မှတ်ခြင်း
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    // Default sort: newest first
    // Note: The sort value must be URL-encoded for safety, but we keep it simple here.
    const sort = searchParams.sort || '{"createdAt":-1}'; 
    
    // API URL ကို တည်ဆောက်ခြင်း
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    
    // Encode the sort parameter to ensure it's safely passed in the URL
    const encodedSort = encodeURIComponent(sort);
    const url = `${API_BASE_URL}/api/posts?page=${page}&limit=${limit}&sort=${encodedSort}`;

    try {
        const res = await fetch(url, {
            // Next.js မှာ Data Fetching ကို Server မှာပဲ တစ်ခါတည်း လုပ်ပြီး Cache မဖြစ်စေဖို့
            // no-cache ကို အသုံးပြုခြင်း။
            cache: 'no-store' 
        });

        if (!res.ok) {
            // API က 500 လို Error ပြန်လာခဲ့ရင်
            throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
        }

        return res.json() as Promise<ApiResponse>;

    } catch (error) {
        console.error("Data Fetching Error:", error);
        // Error ဖြစ်ခဲ့ရင် Empty Data ပြန်ပေးခြင်း
        return {
            success: false,
            message: "Failed to connect to API or internal error.",
            data: [],
            metadata: {
                totalPosts: 0,
                totalPages: 0,
                currentPage: page,
                limit: limit,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null,
            }
        };
    }
}


export default async function ManagePostsPage({ 
    searchParams 
}: { 
    searchParams: { [key: string]: string | string[] | undefined } 
}) {
    
    const { data: posts, metadata, success } = await fetchPosts(searchParams);
    
    const currentPage = metadata.currentPage;
    const totalPages = metadata.totalPages;
    const limit = metadata.limit;

    // Helper function for creating dynamic pagination links
    const createPageLink = (page: number) => {
        // Use a standard URLSearchParams object to manage query parameters
        const params = new URLSearchParams(searchParams as Record<string, string>);
        
        // Update or set the page number
        params.set('page', page.toString());

        // Ensure limit and sort are preserved if they were in the original request
        if (!params.get('limit')) params.set('limit', limit.toString());
        if (!params.get('sort')) {
            // Set default sort if not present
            params.set('sort', '{"createdAt":-1}');
        } else {
             // If sort is present, decode it first before checking if it needs updating (optional but safer)
             // No need to decode here, just ensuring it's present.
        }
        
        return `/posts?${params.toString()}`;
    };

    // Page နံပါတ်တွေ ဘယ်နှစ်ခု ပြရမလဲ တွက်ချက်ခြင်း (Pagination logic improved)
    const pageNumbers: (number | '...')[] = [];
    const maxPageNumbersToShow = 5;
    
    // Calculate the range of pages to display, centered around the current page
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
    
    // Adjust start page if we hit the end bound
    if (endPage - startPage + 1 < maxPageNumbersToShow) {
        startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }
    
    // Add page 1 and ellipsis if necessary
    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    // Add last page and ellipsis if necessary
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        // Ensure totalPages is only added if it's not already in the list
        if (pageNumbers[pageNumbers.length - 1] !== totalPages) {
             pageNumbers.push(totalPages);
        }
    }


    return (
        
        <div className="p-6 md:p-8 lg:p-10 min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
            {/* Tailwind utility classes for dark/light mode are assumed to be defined */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        /* Using a consistent color palette */
                        .text-muted-light { color: #6b7280; } /* Gray 500 */
                        .text-muted-dark { color: #9ca3af; } /* Gray 400 */
                        .bg-surface-light { background-color: #ffffff; }
                        .bg-surface-dark { background-color: #1f2937; } /* Gray 800 */
                        .border-border-light { border-color: #e5e7eb; } /* Gray 200 */
                        .border-border-dark { border-color: #374151; } /* Gray 700 */
                        .bg-primary { background-color: #10b981; } /* Emerald-500 */
                        .hover\\:bg-primary\\/90:hover { background-color: #059669; }
                    `
                }}
            />

            <div className="max-w-7xl mx-auto">
                
                {/* Page Heading & Add New Button */}
                <header className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-4 mb-6 pt-4 md:pt-0">
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                            Manage Posts
                        </p>
                        <p className="text-muted-light dark:text-muted-dark text-base font-normal leading-normal">
                            Add, edit, or delete video posts.
                        </p>
                    </div>
                    {/* Link to Create Post Page (Using standard <a> tag) */}
                    <a
                        href="/posts/create" 
                        className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition duration-150 ease-in-out shadow-md"
                    >
                        {/* Material Symbol: Add (using SVG icon) */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        <span className="truncate">Add New Post</span>
                    </a>
                </header>
                
                {/* SearchBar */}
                <div className="mb-6">
                    <label className="flex flex-col min-w-40 h-12 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-sm">
                            <div className="text-muted-light dark:text-muted-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-lg border border-r-0 border-border-light dark:border-border-dark">
                                {/* Material Symbol: Search (using SVG icon) */}
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </div>
                            <input 
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 bg-surface-light dark:bg-surface-dark h-full placeholder:text-muted-light dark:placeholder:text-muted-dark px-4 rounded-l-none border-l-0 text-base font-normal leading-normal border border-border-light dark:border-border-dark" 
                                placeholder="Search by title or caption..." 
                                type="text"
                                // This is a basic input, full search implementation would require client component
                            />
                        </div>
                    </label>
                </div>

                {/* Loading/Error State */}
                {!success && posts.length === 0 && (
                    <div className="p-8 text-center bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 shadow-md">
                        <p className="font-bold">Error: {metadata.totalPosts > 0 ? "No posts found on this page." : metadata.message}</p>
                        <p className="text-sm">Please check the API connection and data in the database. Ensure NEXT_PUBLIC_API_BASE_URL is set correctly.</p>
                    </div>
                )}
                
                {/* No Data State */}
                {success && posts.length === 0 && (
                     <div className="p-8 text-center bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark shadow-md">
                         <p className="text-gray-900 dark:text-white font-bold">No Posts Available</p>
                         <p className="text-muted-light dark:text-muted-dark text-sm mt-2">Click "Add New Post" to create your first course entry.</p>
                     </div>
                )}

                {/* Table */}
                {posts.length > 0 && (
                    <div className="w-full overflow-x-auto shadow-xl rounded-lg">
                        <div className="flex overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-black/20">
                                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal w-16">Thumbnail</th>
                                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal min-w-[200px]">Title</th>
                                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal min-w-[250px]">Caption</th>
                                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal min-w-[200px]">YouTube URL</th>
                                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal w-32">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post._id} className="border-t border-t-border-light dark:border-t-border-dark hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition duration-150">
                                            <td className="px-4 py-3">
                                                <div 
                                                    className="bg-center bg-no-repeat aspect-video bg-cover rounded w-20 h-11 shadow-sm" 
                                                    data-alt={`Video thumbnail for '${post.title}'`}
                                                    style={{ backgroundImage: `url("${post.imageUrl}")` }}
                                                ></div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-900 dark:text-white text-sm font-medium leading-normal max-w-xs truncate">
                                                {post.title}
                                            </td>
                                            <td className="px-4 py-3 text-muted-light dark:text-muted-dark text-sm font-normal leading-normal max-w-sm truncate">
                                                {post.caption}
                                            </td>
                                            <td className="px-4 py-3 text-muted-light dark:text-muted-dark text-sm font-normal leading-normal max-w-xs truncate">
                                                <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition duration-150">
                                                    {post.youtubeUrl}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold leading-normal tracking-[0.015em]">
                                                <div className="flex items-center gap-4">
                                                    {/* Link to Edit Page (Using standard <a> tag) */}
                                                    <a href={`/posts/edit/${post._id}`} className="text-muted-light dark:text-muted-dark hover:text-blue-500 transition duration-150" aria-label={`Edit ${post.title}`}>
                                                        {/* Material Symbol: Edit (using SVG icon) */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                                            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                        </svg>
                                                    </a>
                                                    {/* Delete Button (Client-side logic required) */}
                                                    <button className="text-muted-light dark:text-muted-dark hover:text-red-500 transition duration-150" aria-label={`Delete ${post.title}`}>
                                                        {/* Material Symbol: Delete (using SVG icon) */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                                            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-muted-light dark:text-muted-dark">
                            Page {currentPage} of {totalPages} ({metadata.totalPosts} total posts)
                        </p>
                        <nav className="flex items-center gap-1">
                            {/* Previous Button (Using standard <a> tag) */}
                            <a 
                                href={metadata.hasPrevPage ? createPageLink(currentPage - 1) : '#'} 
                                className={`flex size-10 items-center justify-center rounded-lg transition duration-150 ${
                                    metadata.hasPrevPage 
                                        ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/20' 
                                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                }`}
                                aria-disabled={!metadata.hasPrevPage}
                            >
                                {/* Material Symbol: chevron_left (using SVG icon) */}
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                                </svg>
                            </a>
                            
                            {/* Page Numbers (Using standard <a> tag) */}
                            {pageNumbers.map((pageNumber, index) => {
                                if (pageNumber === '...') {
                                    return (
                                        <span key={index} className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 rounded-lg">
                                            ...
                                        </span>
                                    );
                                }
                                const page = pageNumber as number;
                                const isCurrent = page === currentPage;
                                return (
                                    <a 
                                        key={page} 
                                        href={createPageLink(page)} 
                                        className={`text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center rounded-lg transition duration-150 ${
                                            isCurrent 
                                                ? 'bg-primary text-white shadow-md' 
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/20'
                                        }`}
                                    >
                                        {page}
                                    </a>
                                );
                            })}
                            
                            {/* Next Button (Using standard <a> tag) */}
                            <a 
                                href={metadata.hasNextPage ? createPageLink(currentPage + 1) : '#'} 
                                className={`flex size-10 items-center justify-center rounded-lg transition duration-150 ${
                                    metadata.hasNextPage 
                                        ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/20' 
                                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                }`}
                                aria-disabled={!metadata.hasNextPage}
                            >
                                {/* Material Symbol: chevron_right (using SVG icon) */}
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                </svg>
                            </a>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}