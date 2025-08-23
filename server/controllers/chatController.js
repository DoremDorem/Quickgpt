import Chat from "../models/Chat.js";

//api controlller for creating chat
export const createChat=async(req,res)=>{
    try {
        const userId=req.user._id;
        const chatData={
            userId,
            messages:[],
            name:"New Chat",
            userName:req.user.name
        }
        await Chat.create(chatData);
        res.json({success:true,message:'chat created'})
    } catch (error) {
        res.json({success:false,error:error.message})
        
    }
}

//get chat data api
export const getChats=async(req,res)=>{
    try {
        const userId=req.user._id;
        const chats=await Chat.find({userId}).sort({updatedAt:-1})
        res.json({success:true,chats,message:'chat created'})
    } catch (error) {
        res.json({success:false,error:error.message})
    }
}

//api of delete chat

export const deleteChat=async(req,res)=>{
    try {
        const userId=req.user._id;
        const {chatId}=req.body;
        await Chat.deleteOne({_id:chatId,userId})
        res.json({success:true,message:'chat deleted'})
    } catch (error) {
        res.json({success:false,error:error.message})
    }
}