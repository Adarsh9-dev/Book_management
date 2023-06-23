import jwt from "jsonwebtoken";

export const authentication = async (req,res,next) => {
    try {
        let expired = false;
        let result;
        const token = req.headers['x-api-key']
        if (!token) {
            return res.status(404).json({status: false, message: "Invalid Token"})
        }

        jwt.verify(token,process.env.SECRET_KEY,(err, decoded)=>{
            if (err) {
                expired = true;
            } else {
                result = decoded;
            }
        })
        if (expired) {
            return res.status(400).json({status: false, message: "Section expired. Login Again"})
        }
        if (!result) {
            return res.status(400).json({status: false, message: "Invalid Token1"})
        }

        req.body.loginUser = result;

        next()

    } catch(err) {
        res.status(500).json({status: false, message: err.message});
    }
}