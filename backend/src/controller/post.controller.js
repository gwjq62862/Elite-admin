import imagekit from "../config/imgKit.js";
import { FreeCourse } from "../Models/freeCourse.model.js"
import { User } from "../Models/user.model.js"



/**
 * @description Creates a new free course post (Requires Admin Role)
 * @route POST /api/posts/
 * @access Private (via requireAuth() middleware)
 * @complexity O(1) near-constant time due to indexed lookups and projection.
 */
export const CreatePost = async (req, res) => {
    
    const clerkUserId = req.auth?.userId; 
    
    const { title, caption, youtubeUrl } = req.body
    
   
    const imageFile = req.file;

    // 1. Auth Check
    if (!clerkUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized: Valid user session required." });
    }
    
    try {
        // 2. Database Read (O(1))
        const author = await User.findOne({ clerkId: clerkUserId }).select('role'); 
        
        if (!author) {
            return res.status(404).json({ success: false, message: "User profile not found in database." });
        }
        
        // 3. Admin Role Check (Authorization Layer)
        if (author.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized: Admin role required for this action." });
        }
        
        // 4. Input Validation 
        if (!title || !caption || !youtubeUrl || !imageFile) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, Caption, YouTube URL, and Image File are all required fields." 
            });
        }

   
        const uploadResponse = await imagekit.upload({
            file: imageFile.buffer.toString('base64'), 
            fileName: `${Date.now()}_${imageFile.originalname.replace(/\s/g, '_')}`,
            folder: '/free_course_thumbnails', 
            tags: ['course', 'admin', clerkUserId],
        });

        const imageUrl = uploadResponse.url; // ImageKit Cdn url
        
        // 6. Database Write (Course Creation) - O(1)
        const newPost = await FreeCourse.create({
            title,
            caption, 
            youtubeUrl,
            imageUrl: imageUrl, 
            author: author._id, 
        });
        
        // 7. Success Response
        res.status(201).json({ 
            success: true, 
            message: "Free course post created successfully", 
            data: newPost 
        });

    } catch (error) {
       
        console.error('Error creating FreeCourse post or uploading image:', error);
        
     
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        
      
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error during post creation or image upload" 
        });
    }
}

export const GetAllPosts = async (req, res) => {
    try {
       
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit; 

        
        let sortQuery = { createdAt: -1 };
        if (req.query.sort) {
        
            try {
                sortQuery = JSON.parse(req.query.sort);
            } catch (e) {
                console.warn("Invalid sort JSON provided, falling back to default sort.");
            }
        }

       
        const totalPosts = await FreeCourse.countDocuments(); 

     
        const posts = await FreeCourse.find()
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .select('-__v'); 

     
        const totalPages = Math.ceil(totalPosts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully with pagination.",
            data: posts,
            metadata: {
                totalPosts,
                totalPages,
                currentPage: page,
                limit: limit,
                hasNextPage,
                hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
            }
        });

    } catch (error) {
        console.error('Error fetching free course posts:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error while fetching posts." 
        });
    }
}