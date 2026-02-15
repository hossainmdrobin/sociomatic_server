
import { Request, Response } from "express";
import { Account } from "../../models/account.model";
import { Admin } from "./../../models/admin.model";

export const addAccount = async (req: Request, res: Response) => {
    const { socialId,token } = req.body;
    try {
        
        const existingAccount = await Account.findOne({ socialId });
        
        if (existingAccount) {
            res.status(400).json({ message: "Account Already exists", success: false, data: {} });
        }
        req.body.addedBy = req.user._id;
        req.body.tokenExpires =  new Date(Date.now() + 59*24*3600*1000);
        const newAccount = new Account({ ...req.body });
        await Admin.findByIdAndUpdate(req.user._id, { $push: { accounts: newAccount._id } });

        await newAccount.save();
        res.status(200).json({ message: "Account created successfully", success: true, data: newAccount });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", seccess: false, error });
    }
}

export const removeAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const account = await Account.findByIdAndDelete(id);
        if (!account) {
            res.status(404).json({ message: "Account not found", success: false });
            return;
        }
        await Admin.findByIdAndUpdate(req.user._id, { $pull: { accounts: id } });
        res.status(200).json({ message: "Account deleted successfully", success: true, data: {} });
    } catch (error) {
        res.status(500).json({ message: "Server error", seccess: false, error });
    }
}