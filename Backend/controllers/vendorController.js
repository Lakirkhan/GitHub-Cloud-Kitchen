const Vendor = require('../models/Vendor');
const Menu = require('../models/Menu');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSKEY
    },
    debug: true,
    logger: true
});

const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'vendor/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });

const upload = multer({ storage: storage });

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1d" });
};

exports.vendorSendOtp = async (req, res) => {
    try {
        const { name, email, mobileNo, address, password  } = req.body;
        // console.log("body",req.body);
        if (!name || !email || !mobileNo || !address || !password || (!req.file)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const imagePath = `/vendor/${req.file.filename}`;
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        if (mobileNo.length !== 10) {
            return res.status(400).json({ message: "Mobile number must be 10 digits" });
        }
        
        const existingVendor = await Vendor.findOne({ where: { email } });

        if (existingVendor && existingVendor.isVerified) {
            return res.status(400).json({ message: "Vendor already exists" });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const encryptedPassword = await bcrypt.hash(password, 10);

        if (existingVendor) {
            await existingVendor.update({ name, mobileNo, address, password: encryptedPassword, otpCode, status: "pending",image:imagePath });
        } else {
            await Vendor.create({ name, email, mobileNo, address, password: encryptedPassword, otpCode, status: "pending",image:imagePath });
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verification Email",
            text: `Your Verification Code Is: ${otpCode}`
        };
        
        await transporter.sendMail(mailOptions);

        setTimeout(async () => {
            const vendor = await Vendor.findOne({ where: { email } });
            if (vendor && !vendor.isVerified) {
                await vendor.destroy();
                console.log(`Unverified user deleted: ${email}`);
            }
        }, 60000);

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error while sending OTP:", error);
        return res.status(500).json({ message: "Error while sending OTP", error: error.message });
    }
};
exports.upload = upload.single('image');

exports.vendorVerifyOtp = async (req, res) => {
    try {
        const { email, verifyOtp } = req.body;

        if (!email || !verifyOtp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const vendor = await Vendor.findOne({ where: { email } });
        if (!vendor) {
            return res.status(400).json({ message: "OTP expired, please try again" });
        }

        if (parseInt(verifyOtp) !== vendor.otpCode) {
            return res.status(400).json({ message: "Invalid verification code. Please try again." });
        }

        await vendor.update({ isVerified: true, otpCode: null });

        const token = generateToken(vendor);
        res.cookie("authToken", token, { httpOnly: true, sameSite: "Strict" });

        return res.status(200).json({ token, message: "User registered successfully" });
    } catch (error) {
        console.error("Error while verifying OTP:", error);
        return res.status(500).json({ message: "Error while verifying OTP", error: error.message });
    }
};

exports.vendorLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        
        const vendor = await Vendor.findOne({ where: { email } });
        if (!vendor) return res.status(400).json({ message: "Email Not Registerd" });
    
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Password" });
    
        const token = generateToken(vendor);
        res.cookie("authToken", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    
        return res.status(200).json({ token, message:"Vendor LoggedIn SuccessFull" });
    
        }
    
     catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Something Went Wrong" });
        }
    };

exports.vendorSendResetCode = async (req, res) => {
    try {
        const { email } = req.body;
    
        const vendor = await Vendor.findOne({ where: { email } });
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    
        const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    
        await vendor.update({ resetCode: randomSixDigit });
    
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Confirmation",
            text: `Your Verification Code Is: ${randomSixDigit}`
        };
    
        try {
            await transporter.sendMail(mailOptions);
            setTimeout(async () => {
                await vendor.update({ resetCode: null });
                console.log(`Reset code expired for ${email}`);
            }, 60000);
            return res.status(200).json({ message: "Verification code sent to your email." });
        } catch (error) {
            return res.status(500).json({ message: "Failed to send email. Try again later." });
        }
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

exports.vendorVerifyCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode ) {
            return res.status(400).json({ message: "Email, verification code are required." });
        }

        const vendor = await Vendor.findOne({ where: { email } });
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        if (vendor.resetCode !== parseInt(verificationCode)) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        await vendor.update({ resetCode: null });

        return res.status(200).json({ status: "success" ,message:"OTP verified"});
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

exports.saveVendorPassword = async(req,res)=>{
    try{
        const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required." });
    }

    const vendor = await Vendor.findOne({ where: { email } });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await vendor.update({ password: encryptedPassword});
    return res.status(200).json({ status:"success" , message: "Password reset successfully." });
    }
    catch(error){
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.vendorLogout = async (req, res) => {
    res.clearCookie("authToken", { httpOnly: true, secure: true, sameSite: "Strict" });
    return res.json({ message: "Logout successful" });
};


exports.getVendorById = async (req, res) => {
    try {
        // const user_id = req.user.id;
        const vendor_id = parseInt(req.params.vendor_id);
        console.log("vendor_id:-",vendor_id,typeof(vendor_id));
        const vendor = await Vendor.findOne({ where: { id: vendor_id }, 
            attributes:["id","name","email","mobileNo","address","image"] ,});

        if (!vendor) {
            return res.status(404).json({ status: "error", message: "Vendor not found" });
        }

        return res.status(200).json({ status: "success", message: "Vendor Fetched Successfully", vendor:vendor });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

exports.editVendorProfile = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { name, mobileNo, address } = req.body;
        // console.log("Request Body:", req.body);
        // console.log("Vendor ID:", req.user.id);

        const vendor = await Vendor.findByPk(user_id);
        console.log("Vendor Found:", vendor);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        await vendor.update({ name, mobileNo, address,
            image: req.file ? `/vendor/${req.file.filename}` : vendor.image },{ where: { id:user_id } });

        return res.status(200).json({ message: "Profile updated successfully", vendor:vendor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAllVendor = async(req,res)=>{
    try{
        const vendors = await Vendor.findAll({ where:{ status:'approved'}, 
            attributes: ['id','name','email','mobileNo','image','address','status'] });
        return res.status(201).json({status:"success",message:"Vendor Fetched Successfully", vendors:vendors})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.getPendingVendor = async(req,res)=>{
    try{
        const vendors = await Vendor.findAll({where: { status: 'pending' },
             attributes: ['id','name','email','mobileNo','image','address','status'] });
        return res.status(201).json({status:"success",message:"Vendor Fetched Successfully", vendors:vendors})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.getVendorStatus = async (req, res) => {
    try {
        const validStatuses = ['pending', 'approved', 'rejected'];
        return res.status(201).json({ status:"success", validStatuses:validStatuses });
    } catch (error) {
        console.error("Fetch Order Statuses Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.approveVendor = async (req, res) => {
    try {
        const { vendor_id, action } = req.body;
        console.log("Req.body",req.body); // status = 'approved' or 'rejected'

        const vendor = await Vendor.findByPk(vendor_id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.status === 'approved') {
            return res.status(400).json({ message: "Vendor is already approved" });
        }

        if (action === 'approved') {
            vendor.status = 'approved';
            await vendor.save();
            return res.status(200).json({ message: "Vendor approved successfully" });
        } else if (action === 'reject') {
            await vendor.destroy(); 
            return res.status(200).json({ message: "Vendor rejected and deleted successfully" });
        } else {
            return res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'." });
        }
    } catch (error) {
        console.log("Error:-",error);
        return res.status(500).json({ error: error.message });
    }
};

exports.addVendorRating = async (req, res) => {
    try {
        const { vendor_id, rating } = req.body;

        if (!vendor_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Invalid vendor ID or rating. Rating must be between 1 and 5." });
        }

        const vendor = await Vendor.findByPk(vendor_id);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        const currentTotalRating = vendor.total_rating ? parseFloat(vendor.total_rating) : 0;
        const currentRatingCount = vendor.rating_count ? vendor.rating_count : 0;

        const newTotalRating = currentTotalRating + parseFloat(rating);
        const newRatingCount = currentRatingCount + 1;
        const newAverageRating = parseFloat((newTotalRating / newRatingCount).toFixed(1));

        await Vendor.update(
            {
                total_rating: newTotalRating,
                rating_count: newRatingCount,
                average_rating: newAverageRating
            },
            { where: { id: vendor_id } }
        );

        return res.status(201).json({
            status: "success",
            message: "Rating added successfully!",
            menuItem: {
                id: vendor.id,
                name: vendor.name,
                average_rating: newAverageRating,
                rating_count: newRatingCount
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

exports.getVendorRatings = async (req, res) => {
    try {
        const vendor_id = parseInt(req.params.vendor_id);
        console.log("Vendor_id",vendor_id);
        const vendor = await Vendor.findByPk(vendor_id, {
            attributes: ['id', 'name', 'rating_count', 'average_rating']
        });

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        return res.status(201).json({ 
            status:"success",
            id: vendor.id,
            name: vendor.name,
            rating_count: vendor.rating_count,
            average_rating:vendor.average_rating !== null ? parseFloat(vendor.average_rating.toFixed(1)) : 0.0
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error", error: error.message });
    }
};

exports.getAllVendorRatings = async (req, res) => {
    try {
        const vendor = await Vendor.findAll({
            attributes: ['id', 'name', 'rating_count', 'average_rating'],
            where:{status:"approved"}
        });

        if (!vendor || vendor.length === 0) {
            return res.status(404).json({ error: "No vendor found." });
        }

        const formattedVendor = vendor.map(item => ({
            id: item.id,
            name: item.name,
            rating_count: item.rating_count ?? 0,
            average_rating: item.average_rating !== null ? parseFloat(item.average_rating.toFixed(1)) : 0.0,
        }));

        return res.status(201).json({ status:"success", formattedVendor:formattedVendor});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error", error });
    }
};


exports.deleteVendorAndMenu = async (req, res) => {
    try {
        const vendorId = req.params.vendor_id;
        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        await Menu.destroy({
            where: { addedBy: vendorId }
        });

        await Vendor.destroy({
            where: { id: vendorId }
        });

        return res.status(200).json({ message: 'Vendor and related menu items deleted successfully' });
    } catch (error) {
        console.error('Error deleting vendor and menu:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

