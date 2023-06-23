import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true })
    .then(() => console.log("Db Connected"))
    .catch((err) => console.log(err))