import User from "../models/userModel.js";
import { isPassword, isReqBody, isTitle, isPhone, isEmail, isPinCode } from "../utils/validator/validate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req,res) => {
    try {   
        const {title, name, phone, email, address, password} = req.body;
        const saltRound = 10;

        if (!isReqBody(req.body)) {
            return res.status(400).json({status: false, message: "Please give some valid data"})
        }
        if (!title ) {
            return res.status(400).json({status: false, message: "Some data are mising"});
        }
        if (!name) {
            return res.status(400).json({status: false, message: "Some data are mising"});
        }
        if (!phone) {
            return res.status(400).json({status: false, message: "Some data are mising"});
        }
        if (!email) {
            return res.status(400).json({status: false, message: "Some data are mising"});
        }
        if (!password) {
            return res.status(400).json({status: false, message: "Some data are mising"});
        }

        if (!isTitle(title)) {
            return res.status(400).json({status: false, message: "Invalid input"});
        }
        if (!isPhone(phone)) {
            return res.status(400).json({status: false, message: "Invalid input"});
        }
        if (!isEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid input"});
        }
        if (!isPassword(password)) {
            return res.status(400).json({status: false, message: "Invalid input"});
        }
        if (address.pincode && !isPinCode(address.pincode)) {
            return res.status(400).json({status: false, message: "Invalid input"});
        }
        if (await User.findOne({phone: phone})) {
            return res.status(400).json({status: false, message: "Phone number is exist"});
        }
        if (await User.findOne({email: email})) {
            return res.status(400).json({status: false, message: "Email is exist"});
        }

        req.body.password = await bcrypt.hash(password, saltRound)

        const result = await User.create(req.body);
        
        const resData = {
            _id: result._id,
            title: result.title,
            name: result.name,
            phone: result.phone,
            email: result.email, 
            password: result.password,
            address: {
              street: result.address.street,
              city: result.address.city,
              pincode: result.address.pincode
            },
            "createdAt":result.createdAt,
            "updatedAt":result.updatedAt
        }
        
        return res.status(201).json({status: true, data: resData}); 
    } catch(err) {
        return res.status(500).json({status: false, message: err.message})
    }
}

export const loginUser = async(req,res) => {
    try {
        const {email, password} = req.body;
        if(!isReqBody(req.body)) {
            return res.status(400).json({status: false, message: "Please give some valid data"})
        }
        if (!email) {
            return res.status(400).json({status: false, message: "Data is missing"})
        }
        if (!password) {
            return res.status(400).json({status: false, message: "Data is missing"})
        }

        if (!isEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid Input"})
        }
        if (!isPassword(password)) {
            return res.status(400).json({status: false, message: "Invalid Input"})
        }

        const isPresent = await User.findOne({email: email}) 
        if (!isPresent) {
            return res.status(400).json({status: false, message: "User not exist"});
        }
        
        if (!await bcrypt.compare(password, isPresent.password)) {
            return res.status(400).json({status: false, message: "User not exist"});
        }

        const payload = {
            data: isPresent
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'})

        res.status(200).json({status: true, data: {token}})

    } catch(err) {
        res.status(500).json({status: false, message: err.message});
    }
}