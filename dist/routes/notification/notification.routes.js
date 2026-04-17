"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("middleware/auth.middleware");
const notification_controller_1 = require("controllers/notificationController/notification.controller");
const router = express_1.default.Router();
router.get("/get_notification", auth_middleware_1.authenticateToken, notification_controller_1.getNotication);
router.post("/update_notificaion", auth_middleware_1.authenticateToken, notification_controller_1.updateNotication);
