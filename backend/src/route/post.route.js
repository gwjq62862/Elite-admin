import express from 'express'
import { CreatePost, GetAllPosts, GetPostById, UpdatePost, DeletePost } from '../controller/post.controller.js'
import { requireAuth } from '@clerk/express'
import multer from 'multer'
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create post route
router.post('/', requireAuth(), upload.single('thumbnail'), CreatePost)

// Get all posts route (with search support) - MUST come before /:id route
router.get('/', GetAllPosts)

// Get single post by ID route
// Note: This route must come after the '/' route to avoid conflicts
router.get('/:id', (req, res, next) => {
    console.log('GetPostById route hit with ID:', req.params.id);
    next();
}, GetPostById)

// Update post route
router.put('/:id', requireAuth(), upload.single('thumbnail'), UpdatePost)

// Delete post route
router.delete('/:id', requireAuth(), DeletePost)

export default router