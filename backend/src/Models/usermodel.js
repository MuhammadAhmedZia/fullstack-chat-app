import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    profilePic:{
        type: String,
        default: ""
    },
},{timestamps:true})

const UserModel = mongoose.model("Users", userSchema)

export default UserModel;