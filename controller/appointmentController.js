import { catchAsyncError } from "../middlwares/catchAsyncError.js";
import Errorhandler from "../middlwares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment =catchAsyncError(async(req,res,next)=>{
    console
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address
    } = req.body;

   console.log(req.body);

    if( !firstName||
        !lastName
       )
        {
            return next(new Errorhandler("Fill the full form",400));
        }

        const isConflict = await User.find({
            firstName:doctor_firstName,
            role:"Doctor",
            doctorDepartment:department
        })
        console.log("ajay Isconflict",isConflict);
        console.log("request",req.user);

          const doctorId = isConflict[0]?._id.toString();
          const patientId = req?.user?._id?.toString();
          console.log("DoctorId:", doctorId);
          console.log("PatientId:", patientId);


        const appointment =await Appointment.create({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            appointment_date,
            department,
            doctor:{
                firstName:doctor_firstName,
                lastName:doctor_lastName
            },
            hasVisited,
            address,
            doctorId,
            patientId,
        })
        res.status(200).json({
            success:true,
            message:"Appoitment sent Succesfully!"
        })
})

export const getAllAppointments=catchAsyncError(async(req,res,next)=>{
    const appointment=await Appointment.find();
    res.status(200).json({
        success:true,
        appointment,
    })
})

export const updateAppointmentStatus = catchAsyncError(async(req,res,next)=>{
    const  {id} = req.params;
    let appointment=await Appointment.findById(id);
    if(!appointment){
        return next(new Errorhandler("Appointment Not Found",404));
    }

    appointment=await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
        message:"Appointment Status updated",
        appointment,
    })

})

export const deleteAppointment=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    if(!appointment)
    {
        return next(new Errorhandler("Appointment Not Found",404));
    }

    await appointment.deleteOne();
    res.status.json({
        success:true,
        message:"Appointment Deleted"
    })
})

export const getAllAppointmentsPatient=catchAsyncError(async(req,res,next)=>{
    console.log(req.body.email);
    const appointments=await Appointment.find({email:req.body.email});
    res.status(200).json({
        success:true,
        appointments,
    })
})