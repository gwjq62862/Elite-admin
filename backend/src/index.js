import express from 'express'
import { ENV } from './config/env.js'
import {clerkMiddleware}from'@clerk/express'
import { connectDB } from './config/db.js'
import userRouter from'./route/user.route.js'
const app=express()
const PORT=ENV.PORT

app.use(clerkMiddleware())
app.use('/api/user',userRouter)

app.listen(PORT,()=>{
    connectDB()
    console.log(`Your Server is Running on ${PORT}`)
})