import express from 'express'
import { ENV } from './config/env.js'
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from './config/db.js'
import userRouter from './route/user.route.js'
const app = express()
const PORT = ENV.PORT
app.use('/ping', (req, res) => {
    res.status(200).json({ message: "your server is wake up" })
})
app.use(express.json())
app.use('/api/user', userRouter)
app.use(clerkMiddleware())


app.listen(PORT, () => {
    connectDB()
    console.log(`Your Server is Running on ${PORT}`)
})