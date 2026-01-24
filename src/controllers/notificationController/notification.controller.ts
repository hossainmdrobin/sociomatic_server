import { Request, Response } from 'express';
import { Notificaiton } from './../../models/notification.model';


export const getNotication = async (req: Request, res: Response) => {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin;

    try {
        const notifications = await Notificaiton.find({ admin }).sort({ createdAt: -1 }).lean();
        res.status(200).json({ message: "Notifications fetched successfully", success: true, data: notifications });

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server error", success: false, error: e });
    }
}

export const updateNotication = async (req:Request, res: Response) => {
    try{
        res.status(200).json({message:"Update Successful", success:true, data:{}})

    }catch(e){
        console.log(e)
        res.status(500).json({message: ""})
    }
}