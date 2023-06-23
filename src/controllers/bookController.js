import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import ReviewModel from "../models/reviewModel.js";
import { isReqBody, isYear } from "../utils/validator/validate.js";
import { queryCounter } from "../utils/helper/helper.js";

export const createBook = async (req,res) => {
    try {
        const { title,excerpt,userId,ISBN,category,subcategory,releasedAt } = req.body;
        
        if (!isReqBody(req.body)) {
            return res.status(400).json({status: false, message: "Enter some data"});
        }
        if (!title) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }
        if (!excerpt) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }
        if (!userId) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }
        if (!ISBN) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }
        if (!category) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }
        if (!subcategory) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }
        if (!releasedAt) {
            return res.status(400).json({status: false, message: "Some data are missing"});
        }

        if (req.body.isDeleted) {
            return res.status(400).json({status: false, message: "You can't delete a book when you creating it"})
        }
        if (!isYear(releasedAt)) {
            return res.status(400).json({status: false, message: "Invalid data"});
        }
        if (!await User.findById(userId)) {
            return res.status(400).json({status: false, message: "User not Exist"});
        }

        const isDetails = await Book.find({$or: [{ISBN:ISBN,isDeleted: false},{title: title,isDeleted:false}]})

        if (isDetails.length !== 0) {
            return res.status(400).json({status: false, message: "Data is Exist"});
        }
        
        let result;
        const isDocumentPresent = await Book.findOne({title: title, ISBN: ISBN, isDeleted: true});
        if (isDocumentPresent) {
            const readyToUpdate = {
                isDeleted: false,
                deletedAt: null,
                excerpt: excerpt,
                userId: userId,
                category: category,
                subcategory: subcategory,
                reviews: req.body.reviews ? req.body.reviews : 0,
                releasedAt: releasedAt,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
            result = await Book.findByIdAndUpdate(isDocumentPresent._id, readyToUpdate,{new: true});
        } else {
            result = await Book.create(req.body);
        }

        const date = new Date(result.releasedAt);
        const newDate = date.toISOString().substring(0,10);
        const resData = {
            "_id": result._id,
            "title": result.title,
            "excerpt": result.excerpt,
            "userId": result.userId,
            "ISBN": result.ISBN,
            "category": result.category,
            "subcategory": result.subcategory,
            "isDeleted": result.isDeleted,
            "reviews":result.reviews,
            "releasedAt": newDate,
            "createdAt": result.createdAt,
            "updatedAt": result.updatedAt,
        }

        res.status(201).json({status: true, data: resData})

    } catch(err) {
        res.status(500).json({status: false, message: err.message})
    }
}

export const showAllBooks = async (req,res) => {
    try {
        let data;
        if (Object.keys(req.query).length === 0) {
            data = await Book.find({isDeleted: false},'__id title excerpt userId category reviews releasedAt').sort({title: 1});
        }
        else {
            if (queryCounter(req.query) !== Object.keys(req.query).length) {
                return res.status(400).json({status: false, message: "Enter valid URL"});
            }
            req.query.isDeleted = false;

            data = await Book.find(req.query,'__id title excerpt userId category reviews releasedAt').sort({title: 1});
        }

        if (data.length === 0) {
            return res.status(404).json({status: false, message: "No books is present"});
        }

        res.status(200).json({status: true, message: 'Books list', data: data});
    
    } catch(err) {
        res.status(500).json({status: false, message: err.message});
    }
}

export const showOneBook = async (req,res) => {
    try {
        const bookId = req.params.bookId;
 
        const updateBook = await Book.findOne({_id: bookId, isDeleted: false},'__id title excerpt userId category subcategory isDeleted reviews releasedAt createdAt updatedAt');
        if (!updateBook) {
            return res.status(404).json({status: false, message: "No books is present"});
        }

        //Reviews
        const result = await ReviewModel.find({bookId: bookId, isDeleted: false}, '_id bookId reviewedBy reviewedAt rating review');

        const newResult = {
            _id: updateBook._id,
            title: updateBook.title,
            excerpt: updateBook.excerpt,
            userId: updateBook.userId,
            category: updateBook.category,
            subcategory: updateBook.subcategory,
            isDeleted: updateBook.isDeleted,
            reviews: updateBook.reviews,
            releasedAt: updateBook.releasedAt,
            createdAt: updateBook.createdAt,
            updatedAt: updateBook.updatedAt,
            reviewsData: result
        }
        res.status(200).json({status: true, message: "Book List", data: newResult});
    
    } catch(err) {
        res.status(500).json({status: false, message: err.message});
    }
}

export const updateBook = async (req,res) => {
    try {
        const bookId = req.params.bookId;
        const {title, excerpt, releasedAt, ISBN} = req.body;
        if (!isReqBody(req.body)) {
            return res.status(400).json({status: false, message: "Something going wrong"})
        }

        //Book is exist or not that checked in Autherisation Part

        const updateObj = {}
        
        if (title) 
            updateObj.title = title 
        if (excerpt) 
            updateObj.excerpt = excerpt 
        if (releasedAt) 
            updateObj.releasedAt = releasedAt 
        if (ISBN) 
            updateObj.ISBN = ISBN 

        const uniqueTitle = await Book.find({$or:[{ISBN: ISBN, _id: {$ne: bookId}}, {title: title, _id: {$ne: bookId}} ]});
        if (uniqueTitle.length > 0) {
            return res.status(400).json({status: false, message: "Data must be unique"});
        }
        
        const result = await Book.findByIdAndUpdate(bookId,updateObj,{new: true});
        res.status(200).json({status: true, message: "Updated Successfully", data: result})

    } catch(err) {
        res.status(500).json({status: false, message: err.message})
    }
}

export const deleteBook = async (req,res) => {
    try {
        const bookId = req.params.bookId;
        //Book is exist or not that checked in Autherisation Part

        const deleteObj = {
            isDeleted: true,
            deletedAt: Date.now()
        }

        const result = await Book.findByIdAndUpdate(bookId, deleteObj, {new: true})
        res.status(200).json({status: true, message: "Deleted Successfully"})

    } catch(err) {
        res.status(500).json({status: false, message: err.message})
    }
}