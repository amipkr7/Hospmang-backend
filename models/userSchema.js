import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
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
  password:{
    type:String,
    required:true,
    minLength:[8,"password must contain atleast 8 characters"],
    required:true,
    select:false
  },
  role:{
    type:String,
    required:true,
    enum:["Admin","Patient","Doctor"]
  },
  doctorDepartment:{
    type:String
  },
  docAvatar:{
    public_id:String,
    url:String
  }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });

userSchema.methods.comparePassword = async function(enteredPassword)
{
  return bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.generateJwttoken= async function()
{
  return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRES
  })
}//in jwt we store are actual data as payload...whoever had that secret_key can make tokens

export const User = mongoose.model("User", userSchema);