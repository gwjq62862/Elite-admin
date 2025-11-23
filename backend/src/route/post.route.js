import express from 'express'
import { CreatePost, GetAllPosts } from '../controller/post.controller.js'
import { requireAuth } from '@clerk/express'
import multer from'multer'
const router=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/', requireAuth(), upload.single('thumbnail'), CreatePost)
router.get('/',GetAllPosts)
export default router