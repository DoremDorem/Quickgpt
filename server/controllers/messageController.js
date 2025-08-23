import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../config/imageKit.js";
import openai from "../config/openAi.js";
//Text Base Ai Chat  message Controller
export const textMessageController=async(req,res)=>{
    try {
        const userId=req.user._id;
        if(req.user.credits<1){
            return res.json({success:false,message:"you don't have enouph credit to use this features"})
        }
        const {chatId,prompt}=req.body;
        const chat=await Chat.findOne({userId,_id:chatId});
        chat.messages.push({role:"user",content:prompt,timestamp:Date.now(),isImage:false});
        const {choices} = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        const reply={...choices[0].message,timestamp:Date.now(),isImage:false}
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id:userId},{$inc:{credits:-1}});
        return res.json({success:true,reply})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


//image generation message controller
export const imageMessageContainer=async(req,res)=>{
    try {
        const userId=req.user._id;
        if(req.user.credits<2){
            return res.json({success:false,message:"you don't have enouph credits to use this featured"})
        }
        const {prompt,chatId,isPublished}=req.body;
        const chat=await Chat.findOne({userId,_id:chatId});
        //push message
        chat.messages.push({
            role:"user",
            content:prompt,
            timestamp:Date.now(),
            isImage:false
        });
       //encode prompt
       const encodedPrompt=encodeURIComponent(prompt);
       //construct imagekit ai generated URL
       const generatedImageUrl=`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/${Date.now()}.png?tr=w-800,h-800`
       const aiImageResponse=await axios.get(generatedImageUrl,{responseType:"arraybuffer"});
       //converted to base64
       const base64Image=`data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;
       //upload to image kit media library
       const uploadResponse=await imagekit.upload({
        file:base64Image,
        fileName:`${Date.now()}.png`,
       });

        const reply={role:'assistant',content:uploadResponse.url,timestamp:Date.now(),isImage:true,isPublished}
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id:userId},{$inc:{credits:-2}});
        return res.json({success:true,reply})

    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}