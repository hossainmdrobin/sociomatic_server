"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.loginWithEmail = exports.verifyOTP = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_model_1 = require("../models/admin.model");
const otp_util_1 = require("../utils/otp.util");
const email_service_1 = require("../services/email.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// This controller handles user signup and OTP verification and Login
// It includes two main functions: signup and verifyOTP
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = yield admin_model_1.Admin.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use", success: false });
            return;
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Generate OTP
        const otp = (0, otp_util_1.generateOTP)();
        console.log("Generated OTP:", otp); // Log the generated OTP for debugging
        const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 5 mins
        // Save user with OTP
        const newUser = new admin_model_1.Admin({ email, name, password: hashedPassword, otp, otpExpires });
        yield newUser.save();
        // Send OTP via email
        yield (0, email_service_1.sendOTP)(email, otp);
        res.status(200).json({ message: "OTP sent. Verify to complete signup.", success: true, data: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", seccess: false, error });
    }
});
exports.signup = signup;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Find user
        const user = yield admin_model_1.Admin.findOne({ email });
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
            yield user.save();
        }
        res.status(200).json({ message: "Signup successful. You can now login.", success: true });
        return;
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.verifyOTP = verifyOTP;
// This Controller is about Loggin with email
const loginWithEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log({ email, password });
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
        const user = yield admin_model_1.Admin.findOne({ email }); // Replace with your ORM query
        if (!user) {
            res.status(401).json({
                message: 'You are not signed up. Please signup first.',
                success: false,
                error: 'User not found',
            });
            return;
        }
        if (user) {
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({
                    message: 'Invalid credentials.',
                    success: false,
                    error: 'Incorrect password',
                });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, roll: user.roll }, process.env.JWT_SECRET || "", { expiresIn: '7d' });
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
    }
    catch (err) {
        res.status(500).json({
            message: 'Login failed.',
            success: false,
            error: err.message,
        });
    }
});
exports.loginWithEmail = loginWithEmail;
// get user info
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield admin_model_1.Admin.findById(req.user._id).populate('accounts');
        res.status(200).json({ success: true, data: user, message: "User info fetched successfully" });
    }
    catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ success: false, message: "Some thing went wrong", error });
    }
});
exports.getUserInfo = getUserInfo;
