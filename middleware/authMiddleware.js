import userSchema from "../models/userSchema.js"
import { verifyToken } from "../utils/token.js"

export const authMiddleware = async (req, res, next) => {
    // extract token from authorization
    const requestToken = req.headers.authorization
    if(!requestToken){
        return res.status(401).json({
            message: "Not Authroized."
        })
    }
    // geting only token part
    const parsedToken = requestToken.replace("Bearer ", "")
    
    // check the validity of
    const verifiedData = verifyToken(parsedToken)

    if(!verifiedData) {
        return res.status(401).json({
            message: "Not valid token."
        })
    }

    const user = await userSchema.exists({
        email: verifiedData.email
    })

    if(!user){
        return res.status(401).json({
            message: "Not Authroized."
        })
    }

    req.user = {
        email: verifiedData.email,
        address: verifiedData.address,
        _id: verifiedData._id
    }
    next()
}