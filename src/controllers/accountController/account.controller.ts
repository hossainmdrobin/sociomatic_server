
import { Request, Response } from "express";
import { Account } from "../../models/account.model";
import { Admin } from "./../../models/admin.model";
import {getAppId, getAppSecret, getFBGraphURL} from "./../../config/facebook"

export const addAccount = async (req: Request, res: Response) => {
    const { socialId,token } = req.body;
    const fullUrl = `${getFBGraphURL()}?grant_type=fb_exchange_token&client_id=${getAppId()}&client_secret=${getAppSecret()}&fb_exchange_token=${token}`
    try {
        
        const existingAccount = await Account.findOne({ socialId });
        
        if (existingAccount) {
            res.status(400).json({ message: "Account Already exists", success: false, data: {} });
        }
        const long_live_data = await fetch(fullUrl)
        const long_live_data_json = await long_live_data.json();
        req.body.addedBy = req.user._id;
        req.body.expiresIn = long_live_data_json.expires_in;
        req.body.accessToken = long_live_data_json.access_token;
        const newAccount = new Account({ ...req.body });
        await Admin.findByIdAndUpdate(req.user._id, { $push: { accounts: newAccount._id } });

        await newAccount.save();
        res.status(200).json({ message: "Account created successfully", success: true, data: newAccount });

    } catch (error) {
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