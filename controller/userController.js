import { catchAsyncError } from "../middlwares/catchAsyncError.js";
import Errorhandler from "../middlwares/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from 'cloudinary'

export const patientRegister = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password,role } =
    req.body;
    console.log("hi");
    console.log(typeof firstName);
    console.log(typeof lastName);
    console.log(typeof email);
    console.log(typeof phone);
    console.log(typeof nic);
    console.log(typeof dob);
    console.log(typeof gender);
    console.log(typeof password);

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob  ||
    !password
  ) {
    return next(new Errorhandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new Errorhandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender:"male",
    password,
    role,
  });
  generateToken(user, "User Registered!", 200, res);
});

  
  export const login = catchAsyncError(async (req, res, next) => {
    console.log("login")
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
      return next(new Errorhandler("Please Fill Full Form!", 400));
    }
    if (password !== confirmPassword) {
      return next(
        new Errorhandler("Password & Confirm Password Do Not Match!", 400)
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new Errorhandler("Invalid Email Or Password!", 400));
    }
  
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new Errorhandler("Invalid Email Or Password!", 400));
    }
    if (role !== user.role) {
      return next(new Errorhandler(`User Not Found With This Role!`, 400));
    }
    console.log(user);
    generateToken(user, "Login Successfully!", 201, res);
  });

  export const addAdmin = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, password } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !password
    ) {
      return next(new Errorhandler("Please Fill Full Form!", 400));
    }
  
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(new Errorhandler("Admin With This Email Already Exists!", 400));
    }
  
    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role: "Admin",
    });
    res.status(200).json({
      success: true,
      message: "New Admin Registered",
      admin,
    });
     generateToken(admin,"Admin Registered",200,res);
  });

  export const getAllDoctors= catchAsyncError(async(req,res,next)=>{
    const doctors=await User.find({role:"Doctor"});
    res.status(200).json({
      success:true,
      doctors
    })

  })

  export const getUserDetails= catchAsyncError(async(req,res,next)=>{
    const patient=await User.find({role:"Patient"});
    res.status(200).json({
      success:true,
      patient
    })

  })

  export const adminlogout=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
      httpOnly:true,
      expires:new Date(Date.now()),
    })
    .json({
      success:true,
      message:"User Log Out Succesfully"
    })
  })

  export const patientlogout=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
      httpOnly:true,
      expires:new Date(Date.now()),
    })
    .json({
      success:true,
      message:"patient log Out Succesfully"
    })
  })

  export const addNewDoctor = catchAsyncError(async(req,res,next)=>{
    console.log("Add New Doctor")
    if(!req.files || Object.keys(req.files).length===0)
    {
      return next(new Errorhandler("Doctor Avatar Required",400));
    }
    const {docAvatar}=req.files;
    const allowedFormats=["image/png","image/jpeg","image/webp"];

    if(!allowedFormats.includes(docAvatar.mimetype))
    {
      return next(new Errorhandler("File Format Not Supported!",400));
    }

    console.log("Doc Avatar:",docAvatar.mimetype);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const {firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            doctorDepartment} =req.body;
    
    if(!firstName ||
       !lastName ||
       !email ||
       !phone ||
       !password ||
       !gender ||
       !dob ||
       !nic ||
       !doctorDepartment)
       {
        return next(new Errorhandler("Please provide Full Details",400));
       }

       const isRegistered =await User.findOne({email});
       console.log("isRegistered",isRegistered);
       if(isRegistered){
        return next(new Errorhandler(`${isRegistered.role} already registered with this email`,400));
       }

       const cloudinaryResponse=await cloudinary.uploader.upload(
        docAvatar.tempFilePath
       )
       console.log("Cloudinary Response:", cloudinaryResponse);

       if(!cloudinaryResponse || cloudinaryResponse.error)
       {
        console.error("Cloudinary Error:",
          cloudinaryResponse.error ||"Unknown Clodundiary Error");
       }

       const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role:"Doctor",
        docAvatar:{
          public_id: cloudinaryResponse.public_id,
          url:cloudinaryResponse.secure_url,
        }
       });
       res.status(200).json({
        success:true,
        message:"New Doctor Registered!",
        doctor
       });
  })

  

  