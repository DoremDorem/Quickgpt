import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
//generate token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
//api to register user
export const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        const userExist=await User.findOne({email});
        if(userExist){
            return res.json({success:false,message:'User alreadfy exist'})
        }
        const user=await User.create({name,email,password});
        const token=generateToken(user._id)
        res.json({success:true,token,message:'Account created succesfully'})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//api to login user
export const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email});
        if(user){
            const isMatched=await bcrypt.compare(password,user.password)
            if(isMatched){
                const token=generateToken(user._id);
                return res.json({success:true,token,message:'user Logged In succesfully'})
            }
        }
        return res.json({success:false,message:'invalid email or password'})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//api for get data
export const getUser=async(req,res)=>{
    try {
        const user=req.user;
        return res.json({success:true,user})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//Api to get pubLished Image
export const getPublishedImages=async(req,res)=>{
    try {
        const publishedImageMessage=await CharacterData.aggregate([
            {$unwind:"$messages"},
            {
                $match:{
                    "messages.isImage":true,
                    "messages.isPublished":true
                }
            },
            {
                $project:{
                    _id:0,
                    imageUrl:"$messages.content",
                    username:"$username"
                }
            }
        ]);
        res.json({success:true,images:publishedImageMessage.reverse()})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}