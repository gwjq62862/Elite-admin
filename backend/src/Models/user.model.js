import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  firstName: String,
  lastName: String,
  imageUrl: String,
  role:{
    required:true,
    type:String,
    enum:["user",'admin'],
    default:"user",
  }
},{timestamps:true})

export const User = mongoose.model('User', userSchema)