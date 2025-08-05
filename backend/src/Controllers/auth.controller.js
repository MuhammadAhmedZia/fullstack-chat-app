import UserModel from "../Models/usermodel.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/utils.js";
import cloudinary from "../utils/cloudinary.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 digit" });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exist" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new UserModel({
            name: name,
            email: email,
            password: hashPassword
        });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("error occurr on signup controller", error.message);
        res.status(500).json({ message: "internal server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid credential" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "invalid password" })
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("error occurr on login controller", error.message);
        res.status(500).json({ message: "internal server error" })
    }

}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "user logout successfully" })
    } catch (error) {
        console.log("error occurr on logout controller", error.message);
        res.status(500).json({ message: "internal server error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic is required" })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const uploadUser = await UserModel.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(uploadUser)

    } catch (error) {
        console.log("error occurr on uploadProfile controller", error.message);
        res.status(500).json({ message: "internal server error" })
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error occurr on checkAuth controller", error.message);
        res.status(500).json({ message: "internal server error" })
    }
}