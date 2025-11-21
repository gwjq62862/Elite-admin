'use client';

import React, { useState, useCallback } from "react";
import { useUser } from '@clerk/nextjs';
import { Upload, X, Loader2 } from 'lucide-react';

// Shared Components
import InputGroup from "@/app/components/InputGroup";
import Toast from "@/app/components/Toast";

// Constants for File Upload Validation
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg', 
    'image/png', 
    'image/gif',
];
const MAX_FILE_SIZE_MB = 10; 

// Form Data State Interface
interface PostData {
    youtubeUrl: string;
    title: string;
    caption: string;
}

// Toast Status Type
type ToastType = { 
    isVisible: boolean; 
    content: string; 
    color: 'bg-green-500/90' | 'bg-red-500/90'; 
};

export default function CreatePostPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [formData, setFormData] = useState<PostData>({
        youtubeUrl: '',
        title: '',
        caption: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<ToastType>({ isVisible: false, content: '', color: 'bg-green-500/90' });
    
    // Auth မရှိသေးရင် Loading ပြသခြင်း
    if (!isLoaded) {
        return (
            <div className="flex-1 p-6 sm:p-8 lg:p-12 text-center text-gray-400">
                Loading user data...
            </div>
        );
    }
    
    // Auth မရှိရင် ဝင်ခွင့်မပြုခြင်း
    if (!isSignedIn) {
        return (
            <div className="flex-1 p-6 sm:p-8 lg:p-12 text-center text-red-400">
                You must be signed in to create a post.
            </div>
        );
    }

    // Input Fields များကို ကိုင်တွယ်ခြင်း
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id === 'youtube-url' ? 'youtubeUrl' : e.target.id === 'post-title' ? 'title' : 'caption']: e.target.value,
        });
    };

    // File ကို ရွေးချယ်သည့်အခါ စစ်ဆေးခြင်း
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(null);
        closeToast();
        
        const file = event.target.files?.[0];

        if (!file) return;

        // 1. File Size Validation
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setToast({
                isVisible: true,
                content: `ဖိုင် အရွယ်အစားသည် ${MAX_FILE_SIZE_MB}MB ထက် မကျော်လွန်ရပါ။`,
                color: 'bg-red-500/90',
            });
            return;
        }

        // 2. File Type Validation (Images only: JPG, PNG, GIF)
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setToast({
                isVisible: true,
                content: 'Custom Thumbnail အတွက် JPG, PNG သို့မဟုတ် GIF ကိုသာ ခွင့်ပြုပါသည်။',
                color: 'bg-red-500/90',
            });
            return;
        }

        setSelectedFile(file);
    }, []);

 
    const closeToast = () => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    };

  
    const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;

     
        if (!formData.title || !formData.youtubeUrl) {
            setToast({ isVisible: true, content: 'Title နှင့် YouTube URL များ ဖြည့်သွင်းရန် လိုအပ်ပါသည်။', color: 'bg-red-500/90' });
            return;
        }

        setIsLoading(true);
        closeToast();

        const dataToSend = new FormData();
        
  
        dataToSend.append('youtubeUrl', formData.youtubeUrl);
        dataToSend.append('title', formData.title);
        dataToSend.append('caption', formData.caption);
        
     
        dataToSend.append('userId', user?.id || 'anonymous');
        dataToSend.append('userEmail', user?.primaryEmailAddress?.emailAddress || 'N/A');

  
        if (selectedFile) {
          
            dataToSend.append('thumbnail', selectedFile); 
        }

        try {
           
            const response = await fetch('https://elite-admin-71bb.onrender.com/api/posts/', {
                method: 'POST',
              
                body: dataToSend,
            });

            if (!response.ok) {
                // Backend မှ Error Response ကို ကိုင်တွယ်ခြင်း
                const errorData = await response.json();
                throw new Error(errorData.message || 'Post Creation ပြုလုပ်ရာတွင် အမှားအယွင်း ရှိခဲ့ပါသည်။');
            }

            // အောင်မြင်ပါက
            setToast({ isVisible: true, content: 'Post အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ။', color: 'bg-green-500/90' });
            
            // Form Data များကို ရှင်းလင်းခြင်း (Best Practice)
            setFormData({ youtubeUrl: '', title: '', caption: '' });
            setSelectedFile(null);

        } catch (error: any) {
            console.error('Post Creation Error:', error);
            setToast({ isVisible: true, content: error.message || 'ကွန်ယက် ချိတ်ဆက်မှု ပြဿနာ သို့မဟုတ် Server Error ရှိခဲ့ပါသည်။', color: 'bg-red-500/90' });
        } finally {
            setIsLoading(false);
        }
    };
    
    // File Input UI အတွက် Helper
    const fileInputId = "custom-thumbnail";

    return (
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
            <div className="mx-auto max-w-3xl">
                
                {/* Page Heading */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                        Create New Post
                    </h1>
                </div>

                <form onSubmit={handleCreatePost}>
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
                            
                            <label 
                                htmlFor={fileInputId} 
                                className={`flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 
                                    ${selectedFile ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-600 dark:border-white/20 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-800/50 dark:bg-[#2C2C2E]'}
                                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                                `}
                            >
                                <input 
                                    id={fileInputId}
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept={ALLOWED_IMAGE_TYPES.join(', ')} // Images only: JPG, PNG, GIF
                                    disabled={isLoading}
                                />
                                <div className="text-center">
                                    {selectedFile ? (
                                        <div className="flex flex-col items-center">
                                            <span className="material-symbols-outlined text-green-500 !text-4xl">
                                                check_circle
                                            </span>
                                            <p className="mt-2 text-sm text-white font-semibold truncate max-w-full">{selectedFile.name}</p>
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.preventDefault(); setSelectedFile(null); closeToast(); }}
                                                className="mt-1 text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                                disabled={isLoading}
                                            >
                                                <X className="w-3 h-3"/> ဖယ်ရှားရန်
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 !text-4xl">
                                                upload_file
                                            </span>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="font-semibold text-indigo-500">Click to upload</span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, GIF up to {MAX_FILE_SIZE_MB}MB</p>
                                        </>
                                    )}
                                </div>
                            </label>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                If empty, the YouTube thumbnail will be used by default.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                            <button 
                                type="button"
                                className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-sm font-bold leading-normal tracking-wide transition-colors hover:bg-gray-300 dark:hover:bg-white/20"
                                onClick={() => {
                                    setFormData({ youtubeUrl: '', title: '', caption: '' });
                                    setSelectedFile(null);
                                    closeToast();
                                }}
                                disabled={isLoading}
                            >
                                <span className="truncate">Cancel/Clear</span>
                            </button>
                            <button 
                                type="submit"
                                className={`w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-white text-sm font-bold leading-normal tracking-wide transition-all duration-200 ${
                                    isLoading 
                                        ? 'bg-indigo-900 opacity-70 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    <span className="truncate">Create Post</span>
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