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

/**
 * @description Fetches all free course posts with pagination and search support
 * @route GET /api/posts/
 * @access Public
 * @complexity O(n) where n is the number of matching documents. Optimized with indexes on title/caption and pagination.
 */
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

        // Build search query - O(1) to O(n) depending on index usage
        let searchQuery = {};
        if (req.query.search && req.query.search.trim()) {
            const searchTerm = req.query.search.trim();
            // Use case-insensitive regex for text search
            // MongoDB can optimize this with text indexes if created
            searchQuery = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { caption: { $regex: searchTerm, $options: 'i' } }
                ]
            };
        }


        const totalPosts = await FreeCourse.countDocuments(searchQuery);


        const posts = await FreeCourse.find(searchQuery)
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

/**
 * @description Updates an existing free course post (Requires Admin Role)
 * @route PUT /api/posts/:id
 * @access Private (via requireAuth() middleware)
 * @complexity O(1) - Indexed lookup by _id, single document update operation.
 */
export const UpdatePost = async (req, res) => {
    const clerkUserId = req.auth?.userId;
    const postId = req.params.id;
    const { title, caption, youtubeUrl } = req.body;
    const imageFile = req.file;

    // 1. Auth Check
    if (!clerkUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Valid user session required."
        });
    }

    // 2. Validate Post ID
    if (!postId || !postId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: "Invalid post ID format."
        });
    }

    try {
        // 3. Database Read - O(1) with indexed _id lookup
        const author = await User.findOne({ clerkId: clerkUserId }).select('role');

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "User profile not found in database."
            });
        }

        // 4. Admin Role Check
        if (author.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin role required for this action."
            });
        }

        // 5. Find existing post - O(1) with indexed _id
        const existingPost = await FreeCourse.findById(postId);

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        // 6. Build update object (only include provided fields)
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (caption !== undefined) updateData.caption = caption;
        if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;

        // 7. Handle image upload if provided
        if (imageFile) {
            // Delete old image from ImageKit (optional - can be async/background job)
            // For now, we'll just upload the new one
            const uploadResponse = await imagekit.upload({
                file: imageFile.buffer.toString('base64'),
                fileName: `${Date.now()}_${imageFile.originalname.replace(/\s/g, '_')}`,
                folder: '/free_course_thumbnails',
                tags: ['course', 'admin', clerkUserId],
            });
            updateData.imageUrl = uploadResponse.url;
        }

        // 8. Validate at least one field is being updated
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update."
            });
        }

        // 9. Update post - O(1) single document update
        const updatedPost = await FreeCourse.findByIdAndUpdate(
            postId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-__v');

        // 10. Success Response
        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });

    } catch (error) {
        console.error('Error updating post:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error during post update."
        });
    }
}

/**
 * @description Deletes an existing free course post (Requires Admin Role)
 * @route DELETE /api/posts/:id
 * @access Private (via requireAuth() middleware)
 * @complexity O(1) - Indexed lookup by _id, single document deletion operation.
 */
export const DeletePost = async (req, res) => {
    const clerkUserId = req.auth?.userId;
    const postId = req.params.id;

    // 1. Auth Check
    if (!clerkUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Valid user session required."
        });
    }

    // 2. Validate Post ID
    if (!postId || !postId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: "Invalid post ID format."
        });
    }

    try {
        // 3. Database Read - O(1) with indexed _id lookup
        const author = await User.findOne({ clerkId: clerkUserId }).select('role');

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "User profile not found in database."
            });
        }

        // 4. Admin Role Check
        if (author.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin role required for this action."
            });
        }

        // 5. Find and delete post - O(1) with indexed _id
        const deletedPost = await FreeCourse.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        // 6. Optional: Delete image from ImageKit (can be async/background job)
        // For production, consider implementing a background job to clean up images
        // await imagekit.deleteFile(deletedPost.imageUrl);

        // 7. Success Response
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: { id: deletedPost._id }
        });

    } catch (error) {
        console.error('Error deleting post:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error during post deletion."
        });
    }
}