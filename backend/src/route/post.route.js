import express from 'express'
import { CreatePost, GetAllPosts, UpdatePost, DeletePost } from '../controller/post.controller.js'
import { requireAuth } from '@clerk/express'
import multer from 'multer'
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create post route
router.post('/', requireAuth(), upload.single('thumbnail'), CreatePost)

// Get all posts route (with search support)
router.get('/', GetAllPosts)

// Update post route
router.put('/:id', requireAuth(), upload.single('thumbnail'), UpdatePost)

// Delete post route
router.delete('/:id', requireAuth(), DeletePost)

export default router