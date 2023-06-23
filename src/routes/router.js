import express from "express";
import { createUser, loginUser } from "../controllers/userController.js";
import { createBook, showAllBooks, showOneBook, updateBook, deleteBook } from "../controllers/bookController.js"
import { createReview, updateReview, deleteReview } from "../controllers/reviewController.js"
import { authentication } from "../services/authentication.js";
import { autherisation } from "../services/autherisation.js";

const router = express.Router();

//-------------------------------------------------------------------
router.post('/register', createUser); //User Register
router.post('/login', loginUser); //User Login

//-------------------------------------------------------------------
router.post('/books', authentication, autherisation, createBook); //Create Book
router.get('/books', authentication, showAllBooks); //Show All Books and Filter
router.get('/books/:bookId', authentication, showOneBook); //Show only one Book
router.put('/books/:bookId', authentication, autherisation, updateBook); //Update one Book
router.delete('/books/:bookId', authentication, autherisation, deleteBook); //Delete a Book

//-------------------------------------------------------------------
router.post('/books/:bookId/review', createReview); //Create Review
router.put('/books/:bookId/review/:reviewId', updateReview); //Update Review
router.delete('/books/:bookId/review/:reviewId', deleteReview); //Delete Review

//-------------------------------------------------------------------

export default router;