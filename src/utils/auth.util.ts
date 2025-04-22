import jwt from 'jsonwebtoken';

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};


// Generate JWT token
export const generateTokens = (user: any): { accessToken: string; refreshToken: string } => {
    if (!process.env.ACCESS_SECRET) {
        throw new Error("ACCESS_SECRET is not defined in the environment variables.");
    }
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    if (!process.env.REFRESH_SECRET) {
        throw new Error("REFRESH_SECRET is not defined in the environment variables.");
    }
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};