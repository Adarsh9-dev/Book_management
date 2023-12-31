import mongoose from "mongoose";
import BookModel from "./bookModel.js";

const reviewSchema = new mongoose.Schema ({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: BookModel
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
    },
    reviewedAt: { 
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},{timestamps: true})

export default new mongoose.model('Review',reviewSchema);