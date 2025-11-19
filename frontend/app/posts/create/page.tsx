// app/posts/create/page.tsx

import InputGroup from "@/app/components/InputGroup";
import Toast from "@/app/components/Toast";


export default function CreatePostPage() {
  return (
  
    
    <div className="flex-1 p-6 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-3xl">
            
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                    Create New Post
                </h1>
            </div>

           
            <div className="flex flex-col gap-8 bg-background-light dark:bg-[#1A1A1A] rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-white/10">
                
             
                <InputGroup
                    label="YouTube Video URL"
                    id="youtube-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                />
                
            
                <InputGroup
                    label="Post Title"
                    id="post-title"
                    type="text"
                    placeholder="Enter the title for your post"
                />

                {/* Field: Caption (TextArea Version) */}
                <InputGroup
                    label="Caption"
                    id="caption"
                    isTextArea={true}
                    placeholder="Write a caption for your post..."
                />

                {/* File Uploader */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                        Custom Thumbnail
                    </label>
                    <div className="flex justify-center items-center w-full px-6 py-10 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg bg-gray-100 dark:bg-[#2C2C2E]">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 !text-4xl">
                                upload_file
                            </span>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        If empty, the YouTube thumbnail will be used by default.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                    <button className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-sm font-bold leading-normal tracking-wide">
                        <span className="truncate">Cancel</span>
                    </button>
                    <button className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide">
                        <span className="truncate">Create Post</span>
                    </button>
                </div>
            </div>
        </div>
         {/* <Toast color={'bg-green-500/90'} content={'post created successfully'}/> */}
      
    </div>
  );
}