import Message from '../Models/messageModel.js';
import UserModel from '../Models/usermodel.js';
import cloudinary from '../utils/cloudinary.js';
import { getReceiverSocketId, io } from '../utils/socket.js';

export const getUserForSideBar = async (req, res) => {
    try {
        const logedInUser = req.user._id;
        const filtedUser = await UserModel.find({ _id: { $ne: logedInUser } }).select('-password');
        res.status(200).json(filtedUser)
    } catch (error) {
        console.log("error occurr on getUserForSideBar controller", error);
        res.status(500).json({ message: "internal server error" })
    }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const sendMessages = async (req, res) => {
    try {
        const { text, image }= req.body;
        const { id:receiverId} = req.params;
        const senderId = req.user._id

        let imageUrl;
        if(image){
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }

        const newMessage = new  Message ({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();
        //chat app logic using socket.io

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error Occurr In sendMessages Controller", error);
        res.status(500).json({ message: "internal server error" })
    }
}