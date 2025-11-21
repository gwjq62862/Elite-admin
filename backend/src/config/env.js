import dotenv from'dotenv'

dotenv.config()

export const ENV={
    PORT:process.env.PORT ||3000,
    CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    MONGO_URL:process.env.MONGO_URL,
    webhookSecret :process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT:process.env.IMAGEKIT_URL_ENDPOINT,
}