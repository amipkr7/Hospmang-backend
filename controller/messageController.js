import Errorhandler from '../middlwares/error.js';
import { Message } from '../models/messageSchema.js';
import { catchAsyncError } from '../middlwares/catchAsyncError.js';

export const sendMessage= catchAsyncError(async (req,res,next)=>{
    const {firstName,lastName,email,phone,message}=req.body;
    
    console.log(req.body);
   
    console.log(typeof(phone));
    

    if(!firstName )
    {
        // return res.status(400).json({
        //     success:false,
        //     message:"Please full fill form",
        // });
        return next(new Errorhandler("Please fill full form",400))
    }
    await Message.create({firstName,lastName,email,phone,message})
    res.status(200).json({
        success:true,
        message:"Message Send succesfully",
    })
})

export const getAllMessages =catchAsyncError(async(req,res,next)=>{
    const messages = await Message.find();
    res.status(200).json({
        success:true,
        messages,
    });
}); 