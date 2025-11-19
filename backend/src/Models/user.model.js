import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  firstName: String,
  lastName: String,
  imageUrl: String,

},{timestamps:true})

export const User = mongoose.model('User', userSchema)