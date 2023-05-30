import { Router } from "express";
import userSchema from "../models/userSchema.js";
import { hashPassword } from "../utils/hashPassword.js";
import { checkPassword } from "../utils/checkPassword.js";
import { generateToken } from "../utils/token.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router()

async function registerUser(req, res) {
    // posted data validity
    const { name, password, email, address } = req.body
    if (!name || !password || !email || !address) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        })
    }

    // check if db contain user
    const userExists = await userSchema.exists({
        email
    })

    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User with email already exists"
        })
    }


    // hash password and store to database
    const user = userSchema({
        name, 
        password: await hashPassword(password), 
        email, 
        address
    })
    await user.save()

    // return success response
    return res.json(
        {
            success: true,
            message: "User created successfully."
        }
    )
}

router.post("/register", registerUser)


async function loginUser(req, res) {
    const { email, password } = req.body
    // check if db contain user
    const dbUser = await userSchema.findOne({
        email
    })

    if (!dbUser) {
        return res.status(400).json({
            success: false,
            message: "User with email doesnot exists"
        })
    }
    // check if password is correct
    const isPasswordCorrect = await checkPassword(password, dbUser.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({
            success: false,
            message: "Password is incorrect"
        })
    }
    // generate access token for user
    const accessToken = generateToken({
        email,
        address: dbUser.address,
        _id: dbUser._id,
    });

    return res.json({
        success: true,
        message: "User logged in successfully.",
        data: {
            accessToken,
            role: dbUser.role || "user"
        }
    })
}
router.post("/login", loginUser)
/**
 * GET api for fetching all users
 */
async function getAllUsers(req, res) {
    console.log('from get users', req.user)
    const users = await userSchema.find();
    res.json(users);
    res.end();
}
router.get('/users', authMiddleware, getAllUsers);

/**
 * GET api for fetching a user by id 
 */
async function getUserById(req, res) {
    const user = await userSchema.findOne({
        _id: req.params.id
    });
    res.json(user);
    res.end();
}
router.get('/users/:id', getUserById);

/**
 * POST api for creating a new user
 */
async function addUser(req, res) {
    const { name, age, email, address, role } = req.body;

    if(!name || !age || !email || !address || !role) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        })
    }

    const userExists = await userSchema.exists({
        email
    })

    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User with email already exists"
        })
    }

    const user = await userSchema.create({
        name,
        age,
        email,
        address,
        password: await hashPassword(address),
        role
    });
    return res.json(user);
}
router.post('/users', authMiddleware, addUser);

/**
 * PUT api for updating a user by id
 */
async function updateUser(req, res) {
    const { name, age } = req.body;
    const user = await userSchema.findOneAndUpdate({
        _id: req.params.id
    }, {
        name,
        age
    }, {
        new: true
    });
    return res.json(user);
}
router.put('/users/:id', updateUser);

/**
 * DELETE api for deleting a user by id
 */
async function deleteUser(req, res) {
    const user = await userSchema.findOneAndDelete({ _id: req.params.id });
    return res.json(user);
}
router.delete('/users/:id', deleteUser);

export default router