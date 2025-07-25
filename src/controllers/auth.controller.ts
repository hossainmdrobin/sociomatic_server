import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model";
import { generateOTP } from "../utils/otp.util";
import { sendOTP } from "../services/email.service";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// This controller handles user signup and OTP verification and Login
// It includes two main functions: signup and verifyOTP
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use", success: false });
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    console.log("Generated OTP:", otp); // Log the generated OTP for debugging
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 5 mins

    // Save user with OTP
    const newUser = new Admin({ email, name, password: hashedPassword, otp, otpExpires });
    await newUser.save();

    // Send OTP via email
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent. Verify to complete signup.", success: true, data: newUser });

  } catch (error) {
    res.status(500).json({ message: "Server error", seccess: false, error });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await Admin.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found", success: false });
      return;
    }

    if (user) {
      // Check OTP validity
      if (user.otp != otp || !user.otpExpires || new Date() > user.otpExpires) {
        res.status(400).json({ message: "Invalid or expired OTP", seccess: false });
        return;
      }

      // Mark user as verified
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
    }

    res.status(200).json({ message: "Signup successful. You can now login.", success: true });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// This Controller is about Loggin with email
export const loginWithEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log({email,password})

  // Check email and password is not falsy
  if (!email || !password) {
    res.status(400).json({
      message: 'Email and password are required.',
      success: false,
      error: 'Missing credentials',
    });
    return;
  }

  try {
    const user = await Admin.findOne({ email }); // Replace with your ORM query

    if (!user) {
      res.status(401).json({
        message: 'You are not signed up. Please signup first.',
        success: false,
        error: 'User not found',
      });
      return;
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          message: 'Invalid credentials.',
          success: false,
          error: 'Incorrect password',
        });
        return;
      }

      const token = jwt.sign({ _id: user._id, email: user.email, roll: user.roll }, process.env.JWT_SECRET || "", { expiresIn: '7d' });

      res.status(200).json({
        message: 'Logged in successfully.',
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      });
      return;
    }

  } catch (err: any) {
    res.status(500).json({
      message: 'Login failed.',
      success: false,
      error: err.message,
    });
  }
};


// get user info
export const getUserInfo = async (req:Request,res:Response) =>{
  try{
    const user = await Admin.findById(req.user._id).populate('accounts');
    res.status(200).json({success:true, data:user,message:"User info fetched successfully"})
  }catch(error){
    console.error("Error fetching user info:", error);
    res.status(500).json({success:false, message:"Some thing went wrong", error})
  }
}
