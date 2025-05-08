
import { Request, Response } from "express";
import { Account } from "../../models/account.model";

export const addAccount = async (req: Request, res: Response) => {
    try {
        const { email, type } = req.body;
        const existingAccount = await Account.findOne({ email, type });
        if (existingAccount) {
            await Account.findByIdAndUpdate(existingAccount._id, { ...req.body });
            res.status(200).json({ message: "Account created successfully", success: true, data: {} });
        }
        const newAccount = new Account({ ...req.body });

        await newAccount.save();
        res.status(200).json({ message: "Account created successfully", success: true, data: newAccount });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "Server error", seccess: false, error });
    }
}

// export const removeAccount = async(req:Request, res:Response) => {
//     try{

//     }
// }