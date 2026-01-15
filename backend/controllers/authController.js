import bcrypt from 'bcryptjs'
import UserModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import transporter from '../config/nodemailer.js'

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.json({success: false, message: "Missing required fields"})
        }

        const existingEmail = await UserModel.findOne({email})
        if(existingEmail){
            return res.json({success: false, message: "User already exist with this email id"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new UserModel({name, email, password: hashedPassword})
        await user.save()
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email, 
            subject: 'Welcome to Auth System',
            text: `Welcome to our auth system. Your account has been created with email id: ${email}`
        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true})
    } catch (error) {
        return res.json({success: true, message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({success: false, message: "Email and password are required"})
        }
        
        const user = await UserModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "Invalid Email"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({success: true})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000           
        })
        return res.json({success: true, message: 'Logged Out Successfully'})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Send Verification OTP to the User's Email
export const sendVerificationOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId)
        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"})
        }

        // Generating six-digit otp number 
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verificationOtp = otp;
        user.verificationOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `The otp for account verification is ${otp}. Use this otp to verify your account.`     
        }
        await transporter.sendMail(mailOptions);

        res.json({success: true, message: `Verification otp is send to an email id: ${user.email}`})

    } catch (error) {
        res.json({success: true, message: error.message})
    }
}

// Verify the email using OTP
export const verifyEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const {otp} = req.body;
        if(!userId || !otp){
            return res.json({success: false, message: "Missing Details"})
        }
        const user = await UserModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        if(user.verificationOtp === "" || user.verificationOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"})
        }

        if(user.verificationOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"})
        }
        
        user.isAccountVerified = true;
        user.verificationOtp = "";
        user.verificationOtpExpireAt = 0;
        await user.save()
        return res.json({success: true, message: "Account verified successfully"})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.json({success: false, message: "Email is required"})
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found with this email"})
        }

        // Generating otp 
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        // Saving otp and expiry for this otp in database
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Sending otp 
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset Otp",
            text: `The otp for resetting your password is ${otp}.`
        }
        await transporter.sendMail(mailOption)

        return res.json({success: true, message: "Password reset OTP sent successfully"})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {
    try {
        const {email, otp, newPassword} = req.body;
        console.log(req.body)
        if(!email || !otp || !newPassword){
            return res.json({success: false, message: "Email, otp, and new password are required"})
        }
        const user = await UserModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "user not found"})
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid Otp"})
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"})
        }

        // Encrypting the new password before storing it in user database
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({success: true, message: "Password has been reset successfully!"})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}