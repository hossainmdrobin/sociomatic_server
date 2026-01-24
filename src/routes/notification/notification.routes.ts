import express from 'express';
import { authenticateToken } from "middleware/auth.middleware";
import { getNotication, updateNotication } from 'controllers/notificationController/notification.controller';


const router = express.Router();


router.get("/get_notification", authenticateToken,getNotication);
router.post("/update_notificaion",authenticateToken, updateNotication)
