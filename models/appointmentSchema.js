import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
      maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    },
    nic: {
      type: String,
      required: true,
      minLength: [9, "NIC Must Contain atleast 9 Digits!"],
    },
    dob:{
      type:String,
      // required:[true,"DOB must be filled"]
    },
    gender:{
      type:String,
      required:[true,"gender must be filled"],
      // enum:["male","female","non-binary"]
    },
   
    appointment_date:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true
    },
    doctor:{
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        }
    },
    hasVisited:{
        type:Boolean,
        default:false,
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    patietId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending",
    }
  });

  export const Appointment =mongoose.model("Appointment",appointmentSchema);