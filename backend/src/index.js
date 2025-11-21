import express from 'express'
import { ENV } from './config/env.js'
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from './config/db.js'

import userRouter from './route/user.route.js' 
import { handleClerkWebhook } from './controller/webhook.controller.js'

import postRouter from './route/post.route.js'

const app = express()
const PORT = ENV.PORT

// Health check route
app.use('/ping', (req, res) => {
    res.status(200).json({ message: "your server is wake up" })
})

const allowedOrigins = [
    'http://localhost:3000', 

    'https://your-frontend-domain.com' 
]; 

const corsOptions = {
   
    origin: function (origin, callback) {

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS for origin: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    credentials: true, 
};

app.use(cors(corsOptions)); 


app.post('/api/webhooks/clerk', 
    // express.raw 
    express.raw({ 
        type: 'application/json', 
        verify: (req, res, buf) => {
            req.rawBody = buf.toString(); 
        }
    }), 
    handleClerkWebhook // Webhook Controller 
);


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware()) 

app.use('/api/posts',postRouter)
// app.use('/api/user', userRouter)

app.listen(PORT, () => {
    connectDB()
    console.log(`Your Server is Running on ${PORT}`)
})