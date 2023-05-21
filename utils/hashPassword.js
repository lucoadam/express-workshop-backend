
import bcrypt from 'bcrypt'

export const hashPassword = async (password, saltRound = 11) => {
    const salt = await bcrypt.genSalt(saltRound)
    const hashPassword = await bcrypt.hash(password,salt);
    return hashPassword
}