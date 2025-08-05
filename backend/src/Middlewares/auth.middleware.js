import jwt from 'jsonwebtoken'
import UserModel from '../Models/usermodel.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized -- No token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized -- Invalid Token" });
        }

        const user = await UserModel.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User Not Found" })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("error occurr on protected Route", error.message);
        res.status(500).json({ message: "internal server error" })
    }
}