
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from "validator";
import foodModel from "../models/foodModel.js";

//login
const loginUser= async(req,res)=>{
  const {email,password}=req.body;
  try {
    const user=await userModel.findOne({email});

    if(!user){
       return res.json({success:false,message:"user Doesn't exist"});
    }
    const isMatch=await bcrypt.compare(password,user.password); //ss mk
    if(!isMatch){
        return res.json({success:false,message:"Invalid credentials"});
    }

    const token =createToken(user._id);
    res.json({success:true,token});

  } catch (error) {
    console.log(token);
    res.json({success:false,message:"Error"});
  }
};

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
};

const registerUser= async(req,res)=>{
    const {name,password,email}=req.body;
    try {
        const exists=await userModel.findOne({email});
        if(exists){
            return res.json({success:false,messgae:"User already exists"});
        }
       // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,messgae:"Please enter a valid email"});
        }
      // hashing user password
      const salt=await bcrypt.genSalt(10); //tạo ra một chuỗi salt với độ phức tạp (số lần lặp) là 10.
      const hashedPassword =await bcrypt.hash(password,salt); //bamw mk

      const newUser =new userModel({
        name:name,
        email:email,
        password:hashedPassword
      });
      const user=await newUser.save();
      const token= createToken(user._id);
      res.json({success:true,token});

    } catch (error) {
       console.log(error);
       res.json({success:false,message:"error"});
    }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, address , gender} = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { firstName, lastName, phone, address,gender },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getUserInfo = async (req, res) => {
  const { id } = req.params; 

  try {
    const user = await userModel.findById(id).select('-password'); 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving user data" });
  }
};

const addUser = async (req, res) => {
    let image_filename = `${req.file?.filename}`;
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        zipcode: req.body.zipcode,
        avatar: image_filename
    });
    try {
        await user.save();
        res.json({ success: true, message: 'User Added' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error' });
    }
};

const listUser = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error' });
    }
};

const removeUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'User Removed' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error' });
    }
};
const changePassword = async (req, res) => {
  console.log("Request received:", req.body);
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; 

  try {
      // Trim mật khẩu
      const trimmedOldPassword = oldPassword.trim();
      const trimmedNewPassword = newPassword.trim();
       // Validate password
      if (!trimmedOldPassword || !trimmedNewPassword)
      {
          return res.status(400).json({ success: false, message: "Vui lòng nhập đủ mật khẩu cũ và mới." });
      }
       if (trimmedNewPassword.length < 6)
       {
          return res.status(400).json({ success: false, message: "Mật khẩu mới phải có ít nhất 6 kí tự." });
       }


      const user = await userModel.findById(userId);
      if (!user) {
          console.log("User not found");
          return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
      }

      const isMatch = await bcrypt.compare(trimmedOldPassword, user.password);
      if (!isMatch) {
          console.log("Old password is incorrect");
          return res.status(400).json({ success: false, message: "The old password is incorrect." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(trimmedNewPassword, salt);

      user.password = hashedPassword;
      await user.save();

      console.log("Password updated successfully");
      res.json({ success: true, message: "Đổi mật khẩu thành công." });
  } catch (error) {
      console.error("Error in changePassword:", error);
      res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

export { loginUser, registerUser, listUser, removeUser, addUser, updateUser, getUserInfo,changePassword };