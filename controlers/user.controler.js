const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const register = async (req,res)=>{
  try{
    const exist = await User.findOne({email:req.body.email})
    if(exist) return res.status(400).json({message:"Email already axist"})
    const hashPassword = await bcrypt.hash(req.body.password,10);
    const newUser = new User({
      name:req.body.name,
      email:req.body.email,
      password:hashPassword
    })
    await newUser.save()
    const user = await User.findOne({email:req.body.email})
    res.status(200).json(user)
  }catch(err){
    res.status(500).json({message:err.messege})
  }
}
//update updateProfile

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword, ...otherData } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // পাসওয়ার্ড চেক এবং হ্যাশ
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // অন্যান্য ডেটা আপডেট
    for (let key in otherData) {
      if (otherData[key] !== undefined) user[key] = otherData[key];
    }

    // ফাইল আপডেট
    if (req.files) {
      if (req.files.profilePic) user.profilePic = req.files.profilePic[0].path;
      if (req.files.coverPic) user.coverPic = req.files.coverPic[0].path;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

//login start
const login = async (req,res)=>{
  try{
    const userEmail = await User.findOne({email:req.body.email})
    if(userEmail){
      const validPass = await bcrypt.compare(req.body.password,userEmail.password)
      
      if(validPass){
        const payload = {
          name:userEmail.name,
          id:userEmail._id
        }
        const token = jwt.sign(
          payload,
          process.env.JWT_KEY,
          {
          expiresIn:'1h'
        })
        res.status(200).json({
          "jwt_token":token,
          "message":"user Login successfully"})
      }else{
        res.status(404).json({message:"user invalid password"})
      }
    }
    res.status(404).json({message:"user not found"})
  }catch(err){
    res.status(404).json({message:err.message})
  }
}
//protectedRouter
const protectedRouter = (req,res)=>{
  res.send("<h1>Welcime to mt protectedRouter </h1>")
}
// get user profile
const userProfile = async(req,res)=>{
  try{
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("post")
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    res.status(200).json(user)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

//single userProfile
// controller/userController.js বা routes এর ভেতরে
const singleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'post',
        populate: [
          { path: 'likes', select: 'name profilePic' },
          { path: 'comments', populate: { path: 'user', select: 'name profilePic' } }
        ]
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { singleUser };
module.exports = {register,updateProfile,login,protectedRouter,userProfile,singleUser}