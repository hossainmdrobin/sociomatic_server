import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateOTP } from "../utils/otp.util";
import { sendOTP } from "../services/email.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 mins

    // Save user with OTP
    const newUser = new User({ email, password: hashedPassword, otp, otpExpires });
    await newUser.save();

    // Send OTP via email
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent. Verify to complete signup." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) res.status(400).json({ message: "User not found" });
  
      if(user){
        // Check OTP validity
    //   if (user.otp !== otp || new Date() > user.otpExpires) {
    //      res.status(400).json({ message: "Invalid or expired OTP" });
    //   }
  
      // Mark user as verified
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      }
  
      res.status(200).json({ message: "Signup successful. You can now login." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
