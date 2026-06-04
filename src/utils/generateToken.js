import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    const payload = { id: userId }; 
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN || "7d",}
    );

    // Set JWT token inside a browser cookie after login/authentication 
    res.cookie("jwt", token, {
        // JS in the browser cannot access this cookie
        httpOnly: true,
        // Cookie only sent over HTTPS 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        // 7 days in milliseconds 
        maxAge: 1000 * 60 * 60 * 24 * 7
    })
    return token; 
};