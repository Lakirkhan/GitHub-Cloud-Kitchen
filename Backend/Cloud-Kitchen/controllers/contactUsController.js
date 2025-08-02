const Contact = require('../models/Contactus');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSKEY
    }
});

exports.Contact = async(req,res)=>{
   try{
    const { name, email, subject, message } = req.body; //vendorId

    const user = await Contact.create({
        name:name,
        email:email,
        subject:subject,
        message:message
    })

    const admin = await User.findOne({ where: { role: 1 } });
    if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
    }
    
    // const vendor = await Vendor.findOne({ where: { id: vendorId } });
    // if (!vendor) {
    //     return res.status(404).json({ message: "Vendor not found" });
    // }
    
    const mailOptions = {
        from: email,
        to: admin.email,//[admin.email, vendor.email]
        subject: subject,
        text: `Message: ${message}`
    };
    await transporter.sendMail(mailOptions);
    return res.status(201).json({message:"Your Request Is Received By Us!"});
   }
   catch(error){
    return res.status(404).json({message:error.message})
   }
}
