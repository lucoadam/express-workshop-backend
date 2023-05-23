import jwt from 'jsonwebtoken'

const tokenSecret = process.env.JWT_SECRET || "tokenSecret"
const expiresIn = process.env.JWT_EXPIRE || "2h"

export const generateToken = (data) => {
    return jwt.sign(data, tokenSecret, {
        expiresIn
    })
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, tokenSecret)
    } catch (e) {
        return null
    }
}
