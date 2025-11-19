// app/posts/page.tsx
import Link from 'next/link';


const dummyPosts = [
    { id: 1, title: "How to Design a Modern UI", caption: "A deep dive into modern UI/UX principles.", url: "https://youtube.com/watch?v=abc1234", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBS9u1jzs4kNItumNSJe3k_dk2O9xAe2YQ7u7n45X6DRiCe-ZSOg05trc2viwD2ttdIbZKLetSFlS4YPpppxa-B8Zfp8GCZLlu0wORKhaCzn3zK_3eUadcHm8Z-04zfp1VzN19vQi4rYV7Btzd6r2FqyJnwWQRpHhSWaveznKY3fbKbiMzR2L8HnWLMXMk4nasNlkVDUv7K2SKPtTL58fWZzK7vHeF820pO0JDfU9HD9YvPbEk59R7yYSem1RJTycIkakMv_5yUOYV" },
    { id: 2, title: "Tech Gadget Review 2024", caption: "Unboxing and first impressions of the latest gadgets.", url: "https://youtube.com/watch?v=def5678", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9A3w3RJSTLWkTirfEAFmUPVZSi0wy67NpdaK_jiaJp2dsLPyDPtpsit5-637arvaChjy29SdM7oximdJ9PatZB9Gzpvaj047cqjC0F5XvQ2sAZujiECalSRaaxFOHf5z-HFodIB2sBEC6akARy8WBeV2oqWA85oluxnSp6qO-ciQcqkkuK4-cl6CiKp0yQfjVTKIXKLmZ6gGaIiZKwX2SFZy0Cz7r3KtSguZObFXs8xzeUs4AZTf5Qtuq-vRtkHiOWgFK2qysoVVf" },
    { id: 3, title: "Travel Vlog: The Mountains", caption: "Exploring the serene beauty of the mountains.", url: "https://youtube.com/watch?v=ghi9012", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVSS4gyhyyMv6zUqHy_my1I5xebxx2pw1ZMwi0L-O0pezyaRD2jfCh5TJBb5UgGvMDjELD5zK2_KTXQdcKXl_Ifld0h3gPOgGQLhbLGmiQmQCkH00JKENfiG609IGRc5fZS8jvY0qmlT3nuESnMiaHTvH3Mnhfpoi4FuXCnR1OzRjj3jT0LJHAYigrd1xUYiqWo7Ch7e9KX1rqmqocik-iAo-ZgzhN8i0KJxYZzgHo-f4v0aD4EXyY04qaDzU_4Gv-YmKYxmMULmIE" },
];

export default function ManagePostsPage() {
    return (
       
        <div className="p-6 md:p-8 lg:p-10 min-h-screen">
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
                    {/* Link to Create Post Page */}
                    <Link
                        href="/posts/create" 
                        className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        <span className="truncate">Add New Post</span>
                    </Link>
                </header>
                
                {/* SearchBar */}
                <div className="mb-6">
                    <label className="flex flex-col min-w-40 h-12 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-muted-light dark:text-muted-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-lg border border-r-0 border-border-light dark:border-border-dark">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input 
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 bg-surface-light dark:bg-surface-dark h-full placeholder:text-muted-light dark:placeholder:text-muted-dark px-4 rounded-l-none border-l-0 text-base font-normal leading-normal border border-border-light dark:border-border-dark" 
                                placeholder="Search by title or caption..." 
                                type="text"
                            />
                        </div>
                    </label>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <div className="flex overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                        <table className="w-full">
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
                                {dummyPosts.map((post) => (
                                    <tr key={post.id} className="border-t border-t-border-light dark:border-t-border-dark">
                                        <td className="px-4 py-2">
                                            <div 
                                                className="bg-center bg-no-repeat aspect-video bg-cover rounded w-16 h-9" 
                                                data-alt={`Video thumbnail for '${post.title}'`}
                                                style={{ backgroundImage: `url("${post.thumbnail}")` }}
                                            ></div>
                                        </td>
                                        <td className="px-4 py-2 text-gray-900 dark:text-white text-sm font-normal leading-normal">
                                            {post.title}
                                        </td>
                                        <td className="px-4 py-2 text-muted-light dark:text-muted-dark text-sm font-normal leading-normal">
                                            {post.caption}
                                        </td>
                                        <td className="px-4 py-2 text-muted-light dark:text-muted-dark text-sm font-normal leading-normal truncate">
                                            {post.url}
                                        </td>
                                        <td className="px-4 py-2 text-sm font-bold leading-normal tracking-[0.015em]">
                                            <div className="flex items-center gap-4">
                                                <button className="text-muted-light dark:text-muted-dark hover:text-primary">
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button className="text-muted-light dark:text-muted-dark hover:text-primary">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center mt-6">
                    <nav className="flex items-center gap-1">
                        <a className="flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/20 rounded-lg" href="#">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </a>
                        <a className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-lg bg-primary" href="#">1</a>
                        <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-primary/20" href="#">2</a>
                        <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-primary/20" href="#">3</a>
                        <span className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 rounded-lg">...</span>
                        <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-primary/20" href="#">10</a>
                        <a className="flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/20 rounded-lg" href="#">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    );
}