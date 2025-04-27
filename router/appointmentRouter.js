import express from 'express';
import { postAppointment } from '../controller/appointmentController.js';
import { isAdminAuthenticated } from '../middlwares/auth.js';
import { isPatientAuthenticated } from '../middlwares/auth.js';
import { getAllAppointments } from '../controller/appointmentController.js';
import { updateAppointmentStatus } from '../controller/appointmentController.js';
import { deleteAppointment } from '../controller/appointmentController.js';
import { getAllAppointmentsPatient } from '../controller/appointmentController.js';
const router=express.Router();

router.post('/post',postAppointment);
router.get('/getall',getAllAppointments);
router.put('/update/:id',updateAppointmentStatus);
router.delete('/delete/:id',deleteAppointment);
router.post("/user/getAllAppointments", getAllAppointmentsPatient);

export default router;