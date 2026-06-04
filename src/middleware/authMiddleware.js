import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// Read the token from the request 
// Check if token is valid 
export const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware reached");
    let token; 

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        // Splits into a string array and access the token(second element)
        token = req.headers.authorization.split(" ")[1]; 
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res
            .status(401)
            .json({ error: "Not authorized, no token provided" }); 
    }

    try {
        // Verify token and extract the user Id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res  
                .status(401)
                .json({ error: "User no longer exists"})
        }
        
        // If user exists, attach user to req.user 
        req.user = user;
        next(); 
    } catch (err) {
        return res.status(401).json({ error: "Not authorized, token failed" });
    }
};