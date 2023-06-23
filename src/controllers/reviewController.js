import Book from "../models/bookModel.js";
import ReviewModel from "../models/reviewModel.js";
import { isReqBody, isRating } from "../utils/validator/validate.js"

export const createReview = async (req,res) => {
    try {
        const bookId = req.params.bookId;
        const isPresent = await Book.findOne({_id: bookId, isDeleted: false})
        if (!isPresent) {
            return res.status(404).json({status: false, message: "Book not exist"});
        }

        if (!isReqBody(req.body)) {
            return res.status(400).json({status: false, message: "Something going wrong"});
        }
        const { reviewedBy, rating, review } = req.body;

        if (!rating) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }

        if (!isRating(rating)) {
            return res.status(400).json({status: false, message: "Corrupted Data"});
        }
        const reviewObj = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: Date.now(),
            rating: rating,
            review: review,
        }
        //Update Book review Count
        const updateBook = await Book.findByIdAndUpdate(bookId, {reviews: isPresent.reviews+1},{new: true});

        const result = await ReviewModel.create(reviewObj);
        
        const newResult = {
            _id: updateBook._id,
            title: updateBook.title,
            excerpt: updateBook.excerpt,
            userId: updateBook.userId,
            ISBN: updateBook.ISBN,
            category: updateBook.category,
            subcategory: updateBook.subcategory,
            reviews: updateBook.reviews,
            deletedAt: updateBook.deletedAt,
            isDeleted: updateBook.isDeleted,
            releasedAt: updateBook.releasedAt,
            createdAt: updateBook.createdAt,
            updatedAt: updateBook.updatedAt,
            __v: updateBook.__v,
            reviewsData: result
        }
        res.status(201).json({status: true, message: "Review added successfully", data: newResult})

    } catch(err) {
        res.status(500).json({status: false, message: err.message})
    }
} 

export const updateReview = async (req,res) => {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId;
        
        if (!isReqBody(req.body)) {
            return res.status(400).json({status: false, message: "Something going wrong"});
        }

        const isBook = await Book.findOne({_id: bookId, isDeleted: false})
        if (!isBook) {
            return res.status(404).json({status: false, message: "Book is not exist"});
        }

        const isReview = await ReviewModel.findOne({_id: reviewId, isDeleted: false, bookId: bookId})
        if (!isReview) {
            return res.status(404).json({status: false, message: "Review is not exist"});
        }
        
        const { reviewedBy, rating, review } = req.body;
        let updateObj = {};
        
        if (reviewedBy) 
            updateObj.reviewedBy = reviewedBy
        if (rating)
            updateObj.rating = rating
        if (review)
            updateObj.review = review

        const result = await ReviewModel.findByIdAndUpdate(reviewId, updateObj,{new: true})

        const reviewArray = await ReviewModel.find({bookId: bookId, isDeleted: false}, '_id bookId reviewedBy reviewedAt rating review');

        const newResult = {
            _id: isBook._id,
            title: isBook.title,
            excerpt: isBook.excerpt,
            userId: isBook.userId,
            category: isBook.category,
            subcategory: isBook.subcategory,
            isDeleted: isBook.isDeleted,
            reviews: isBook.reviews,
            releasedAt: isBook.releasedAt,
            createdAt: isBook.createdAt,
            updatedAt: isBook.updatedAt,
            reviewsData: reviewArray
        }
        res.status(200).json({status: true, message: "Book List", data: newResult})

    } catch(err) {
        res.status(500).json({status: false, message: err.message});
    }
}

export const deleteReview = async (req,res) => {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId;

        const isBook = await Book.findOne({_id: bookId, isDeleted: false})
        if (!isBook) {
            return res.status(404).json({status: false, message: "Book is not exist"});
        }

        const isReview = await ReviewModel.findOne({_id: reviewId, isDeleted: false, bookId: bookId})
        if (!isReview) {
            return res.status(404).json({status: false, message: "Review is not exist"});
        }

        const bookChange = await Book.findByIdAndUpdate(bookId,{$inc: {reviews: -1}},{new: true})
        const result = await ReviewModel.findByIdAndUpdate(reviewId, {isDeleted: true}, {new: true})
       
        res.status(200).json({status: true, message: "Deleted Successfully"});

    } catch(err) {
        res.status(500).json({status: false, message: err.message})
    }
}