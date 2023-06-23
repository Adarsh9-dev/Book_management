import express from "express";
import cors from "cors";
import "dotenv/config";
import "./config/dbConn.js";
import centralRouter from "./routes/router.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
const port = process.env.PORT || 8080;

app.use('/',centralRouter);

app.listen(port, ()=> {
    console.log(`Server is running in port ${port}`)
})