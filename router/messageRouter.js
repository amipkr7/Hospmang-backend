import express from 'express'
import { sendMessage } from "../controller/messageController.js";
import { getAllMessages } from '../controller/messageController.js';
import { isAdminAuthenticated } from '../middlwares/auth.js';
const router=express.Router();

router.post('/send',sendMessage);
router.get('/getmessage',isAdminAuthenticated,getAllMessages);

export default router