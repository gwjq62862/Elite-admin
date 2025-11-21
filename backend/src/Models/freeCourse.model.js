import mongoose from "mongoose";

const freeCourseSchmea = new mongoose.Schema({
    // Title (required, trim, max length)
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    // 2. Caption (Fixed typo, required, trim)
    caption: {
        type: String,
        required: true,
        trim: true,
    }, 
    // 3. YouTube URL (required)
    youtubeUrl: {
        type: String,
        required: true,
    },
    // 4. Image URL (Fixed naming convention: ImgUrl -> imageUrl)
    imageUrl: {
        type: String,
        required: true,
    },
    // 5. Author (Reference to User, required)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    }
}, { timestamps: true, });

export const FreeCourse = mongoose.model('FreeCourse', freeCourseSchmea);