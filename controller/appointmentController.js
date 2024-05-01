import { catchAsyncError } from "../middlwares/catchAsyncError.js";
import Errorhandler from "../middlwares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment =catchAsyncError(async(req,res,next)=>{
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
        !lastName||
        !email||
        !phone||
        !nic||
        !dob||
        !gender||
        !appointment_date||
        !department||
        !doctor_firstName||
        !address)
        {
            return next(new Errorhandler("Fill the full form",400));
        }

        const isConflict = await User.find({
            firstName:doctor_firstName,
            role:"Doctor",
            doctorDepartment:department
        })

        if(isConflict.length === 0)
        {
            return next(new Errorhandler("Doctor not Found!",400));
        }

        if(isConflict.length > 1)
        {
            return next(new Errorhandler("Doctor Conflict ! Please Contact through Email or Phone",400));
        }

        const doctorId = isConflict[0]._id;
        const patientId=req.user._id;
        console.log(doctorId);
        console.log(patientId)

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
                lastName:doctor_lastName,
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