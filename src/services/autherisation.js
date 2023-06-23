import Book from "../models/bookModel.js";

export const autherisation = async (req,res,next) => {
    try {
        if (!req.body.loginUser) {
            return res.status(400).json({status: false, message: "Something going wrong"})
        }
        const loginAuthor = req.body.loginUser.data._id;
        let authorId;

        if (req.body.userId) {
            authorId = req.body.userId
        }
        if (req.params.bookId) {
            const bookId = req.params.bookId;
            const isPresent = await Book.findOne({_id: bookId, isDeleted: false});
            if (!isPresent) {
                return res.status(404).json({status: false, message: "Book not exist"})
            }
            authorId = isPresent.userId;
        }

        if (!authorId) {
            return res.status(400).json({status: false, message: "Something going wrong"})
        }
        if (JSON.stringify(loginAuthor) !== JSON.stringify(authorId)) {
            return res.status(400).json({status: false, message: "Unautherised access"});
        }

        next();

    } catch(err) {
        res.status(500).json({status: false, message: err.message})
    }
}