import express from 'express'
import { CreatePost } from '../controller/post.controller.js'
import { requireAuth } from '@clerk/express'
import multer from'multer'
const router=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/', requireAuth(), upload.single('thumbnail'), CreatePost)
export default router