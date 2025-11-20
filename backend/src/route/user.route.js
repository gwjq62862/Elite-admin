import express from'express'
import { createUser } from '../controller/user.controller.js'
import { handleClerkWebhook } from '../controller/webhook.controller.js'

const router=express.Router()






router.post('/webhooks/clerk', handleClerkWebhook)



export default router