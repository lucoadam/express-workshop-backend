import bcrypt from "bcrypt"

export const checkPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}