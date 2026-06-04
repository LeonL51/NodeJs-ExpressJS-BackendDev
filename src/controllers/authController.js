import { prisma } from "../config/db.js"; 
import bcrypt from "bcryptjs"; 
import { generateToken } from "../utils/generateToken.js"; 

const register = async (req, res) => {
    const { name, email, password } = req.body; 

    // Validate fields FIRST
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please provide name, email, and passowrd",
        }); 
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: { email: email },
    }); 

    if (userExists) {
        return res
            .status(400)
            .json({ message: "User already exists with this email"}); 
    }

    // Hash Password 
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    // Create User 
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword, 
        },
    });

    // Send response without password 
    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name, 
                email: email,  
            }
        }
    }); 
};

// Authenticate login 
const login = async (req, res) => {
    const { email, password } = req.body; 

    // Check if user email exists in the tbale 
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res
            .status(401)
            .json({ error: "Invalid email or password"}); 
    }

    // Verify password with the hash password
    const isPasswordValid = await bcrypt.compare(password, user.password); 

    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = generateToken(user.id, res); 

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: email,
            },
            token, 
        },
    });
}; 

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly:true, 
        expires: new Date(0)
    }); 
    res.status(200).json({
        status: "success",
        message: "Logged out succesfully",
    });
}; 

export { register, login, logout };