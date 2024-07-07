import express from "express";
import { patientRegister} from "../controller/userController.js";
import { login } from "../controller/userController.js";
import { addAdmin } from "../controller/userController.js";
import { isAdminAuthenticated } from "../middlwares/auth.js";
import { isPatientAuthenticated } from "../middlwares/auth.js";
import { getAllDoctors } from "../controller/userController.js";
import {getUserDetails } from "../controller/userController.js";
import { adminlogout } from "../controller/userController.js";
import { patientlogout } from "../controller/userController.js";
import { addNewDoctor } from "../controller/userController.js";

const router=express.Router();

router.post("/patient/register",patientRegister);
router.post("/patient/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addAdmin);
router.get("/doctors",getAllDoctors);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/me",getUserDetails);   //may be possible error
router.get("/admin/logout/me",isAdminAuthenticated,adminlogout);
router.get("/patient/logout/me",patientlogout); //may be possible error
router.post("/doctor/add",isAdminAuthenticated,addNewDoctor);
router.get("/doctor/getall",getAllDoctors)

export default router