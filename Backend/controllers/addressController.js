const Address = require('../models/Address');
const User = require('../models/User');

exports.addAddress = async(req,res)=>{
    try{
        const { recipient_name, phone, address, city, state, pincode } = req.body

        if(!recipient_name || !phone || !address || !city || !state || !pincode){
            return res.status(400).json({ message: "All fields are required" });
        }

        const user_id = parseInt(req.user.id);

        const user = await User.findOne({ where : { id: user_id}});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const address_data = await Address.create({
            user_id:user_id,
            recipient_name:recipient_name,
            email:user.email,
            phone:phone,
            address:address,
            city:city,
            state:state,
            pincode:pincode
        });

        return res.status(201).json({ status:"success" , message: 'Address Added Successfully', address:address_data });
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message : "Internal Server Error" });
    }
}

exports.fetchAddressDetailById = async(req,res)=>{
    try{
        const user_id = parseInt(req.user.id);
        const address = await Address.findAll({ where: { user_id: user_id}});
        return res.status(201).json({ status:"success", message:"User Detail Fetched Successfully", address: address})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const { id, recipient_name, phone, address, city, state, pincode } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID Is Required" });
        }

        const user_id = parseInt(req.user.id);
        const addressData = await Address.findOne({ where: { id, user_id } });

        if (!addressData) {
            return res.status(404).json({ message: "Address not found" });
        }

        await Address.update({ recipient_name, phone, address, city, state, pincode },
            { where: { id , user_id } }
        );

        return res.status(200).json({ status: "success", message: "Address updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Address ID is required" });
        }

        const user_id = parseInt(req.user.id);
        const addressData = await Address.findOne({ where: { id, user_id } });

        if (!addressData) {
            return res.status(404).json({ message: "Address not found" });
        }

        await Address.destroy({ where: { id, user_id } });

        return res.status(200).json({ status: "success", message: "Address deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
