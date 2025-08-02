const Order = require('../models/Order');
// const Address = require('../models/Address');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const Menu = require('../models/Menu');
const Category = require('../models/Category');
const nodemailer = require('nodemailer');
// const twilio = require('twilio');
const User = require('../models/User');
// const accountSid = 'AC14d8dc6c80b91b76d5de0a2e7bf5d806';
// const authToken = '25f3371fa01a5df8a696b6f27572c1ab';
// const client = twilio(accountSid, authToken);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSKEY
    },
    debug: true,
    logger: true
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'orders/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
      console.log("Saving file:", filename);
    },
  });

const upload = multer({ storage: storage });

const orderHistory = async (req,res)=>{
    try{
            const { cartItems, billingInfo, shippingInfo, paymentMethod, item_total, status } = req.body;
            const user_id = parseInt(req.user.id);

            const user = await User.findOne({ where: { id: user_id }});
            let parsedItems = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems); 
            console.log("Received file:", req.file);
            
            if (req.file) {
                console.log("Uploaded File:", req.file);
                parsedItems.forEach((item) => {
                    item.image = `/orders/${req.file.filename}`; 
                });
            }
            else {
                console.log("No File Uploaded");
            }

            const order = await Order.create({
                addedby:user_id,
                cartItems:parsedItems,
                billingInfo:billingInfo,
                shippingInfo:shippingInfo,
                paymentMethod:paymentMethod,
                item_total:item_total,
                status:status,
            });

            for (const item of parsedItems) {
                const menuItem = await Menu.findOne({ where: { id: item.item_id } });
                console.log("menuItems:-",menuItem);
                if (menuItem) {
                    const newOrderCount = menuItem.order_count + item.item_qty; 
                    await menuItem.update({ order_count: newOrderCount });
                    console.log(`Updated order_count for item ID: ${item.item_id} to ${newOrderCount}`);
                } else {
                    console.log(`Item ID: ${item.item_id} not found in Menu table`);
                }
            }

            for (const item of parsedItems) {
                const category = await Category.findOne({ where: { category_name:item.category_name } });
                // console.log("category:-",category);
                if (category) {
                    const newOrderCount = category.order_count + 1 ; 
                    await category.update({ order_count: newOrderCount });
                    console.log(`Updated order_count for category: ${item.category_name} to ${newOrderCount}`);
                } else {
                    console.log(`Category: ${item.category_name} not found in Category table`);
                }
            }
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: "Order Confirmation Message",
                text: `Your Order Is Confirmed`
            };
            
            await transporter.sendMail(mailOptions);
            // client.messages.create({
            //     to: `+91${user.mobileNo}`,
            //     from: +15625864060,
            //     body: 'Your Order Is Confirmed!'
            // })
            //     .then(message => {
            //     console.log(`Message sent with SID: ${message.sid}`);
            // })
            //     .catch(error => {
            //      console.error(`Error sending message: ${error}`);
            // });
    console.log("order:-",order);
            return res.status(201).json({ status:"success" , message: 'Order Placed Successfully', order:order });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const fetchOrderHistory = async (req,res)=>{
    try{
        const order = await Order.findAll({
            order: [['createdAt', 'DESC']] 
        });
        return res.status(200).json({ status:"success", history:order });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({ message:"Error While Fetching Items"});
    }
}

const fetchOrderHistoryById = async (req,res)=>{
    try{
        const user_id = req.user.id;
        const order = await Order.findAll({ where: { addedby: user_id },order: [['createdAt', 'DESC']]});
        return res.status(200).json({ status:"success", history:order });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({ message:"Error While Fetching Items"});
    }
}


const countTodayOrders = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const todayOrders = await Order.count({
            where: {
                order_date: {
                    [Op.gte]: new Date(today + " 00:00:00"),
                    [Op.lt]: new Date(today + " 23:59:59")   
                }
            }
        });

        return res.status(200).json({ status: "success", todayOrders:todayOrders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getOrderStatus = async (req, res) => {
    try {
        const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled', 'refunded'];
        return res.status(201).json({ status:"success", validStatuses:validStatuses });
    } catch (error) {
        console.error("Fetch Order Statuses Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const cancelOrderAndRefund = async (req, res) => {
    try {
        const { orderId, cancel_reason } = req.body;
        const user_id = parseInt(req.user.id);
        console.log("cancel body",req.body);

        const order = await Order.findOne({ where: { id: orderId, addedby: user_id } });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.status === "confirmed") {
            return res.status(400).json({ message: "Order cannot be canceled at this stage." });
        }

        const orderTime = new Date(order.createdAt);
        const currentTime = new Date();
        const timeDiff = (currentTime - orderTime) / 60000; 

        if (timeDiff > 5) {
            return res.status(400).json({ message: "Order cancellation time has expired." });
        }

        await Order.update({ status: "cancelled", cancel_reason },
            { where: { id: orderId } }
        );

        if (order.paymentMethod !== "cod") {
            await Order.update({ refund_status: "completed" },
                { where: { id: orderId } }
            );
            return res.status(200).json({ message: "Order cancelled successfully. Your money will be returned within 2 working days." });
        }

        return res.status(200).json({ message: "Order cancelled successfully. No refund needed for COD orders." });

    } catch (error) {
        console.error("Cancel & Refund Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const UpdateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled', 'refunded'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values: pending, confirmed, preparing, delivered, cancelled, refunded." });
        }

        const order = await Order.findOne({ where: { id: orderId } });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        await Order.update({ status: status },
            { where: { id: orderId } }
        );

        return res.json({ message: `Order status updated to ${status} successfully.` });

    } catch (error) {
        console.error("Admin Update Order Status Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const countTotalOrders = async (req, res) => {
    try {
         const { vendorId } = req.params;
         if (!vendorId) {
         return res.status(400).json({ message: "Vendor ID is required" });
         }

        const vendorMenus = await Menu.findAll({
                 where: { addedBy: vendorId },
                 attributes: ['id']
         });

         const menuIds = vendorMenus.map(menu => menu.id);
         if (menuIds.length === 0) {
             return res.status(200).json({ status: "success", totalOrders: 0 });
         }

         const orders = await Order.findAll({
         attributes: ['cartItems']
         });

         let totalOrders = orders.filter(order => {
         let cartItems = order.cartItems;

         if (typeof cartItems === "string") {
            cartItems = JSON.parse(cartItems);
        }

         return cartItems.some(item => menuIds.includes(item.item_id));
         }).length;

         return res.status(200).json({ status: "success", totalOrders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const countTotalRevenue = async(req,res)=>{
    try{
        const { vendorId } = req.params;
        if (!vendorId) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }
        
        const vendorItemIds = await Menu.findAll({
            where: { addedBy: vendorId },
            attributes: ["id"],
            raw: true,
        }).then(items => items.map(item => item.id));

        if (vendorItemIds.length === 0) {
            return res.status(200).json({ status: "success", totalRevenue: 0 });
        }

        const orders = await Order.findAll({ attributes: ["cartItems"] });

        const totalRevenue = orders.reduce((sum, order) => {
            const cartItems = JSON.parse(order.cartItems);
            return sum + cartItems
                .filter(item => vendorItemIds.includes(item.item_id))
                .reduce((subtotal, item) => subtotal + item.item_total, 0);
        }, 0);

        return res.status(200).json({ status: "success", totalRevenue });
    }
    catch(error){
        console.log("Error:-",error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const countTodayRevenue = async (req, res) => {
    try {
        const { vendorId } = req.params;
        if (!vendorId) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }

        const today = new Date().toISOString().split("T")[0];

        const vendorItemIds = await Menu.findAll({
            where: { addedBy: vendorId },
            attributes: ["id"],
            raw: true,
        }).then(items => items.map(item => item.id));

        if (vendorItemIds.length === 0) {
            return res.status(200).json({ status: "success", todayRevenue: 0 });
        }

        
        const orders = await Order.findAll({
            attributes: ["cartItems"],
            where: {
                order_date: {
                    [Op.gte]: new Date(today + " 00:00:00"),
                    [Op.lt]: new Date(today + " 23:59:59"),
                },
            },
        });

        const todayRevenue = orders.reduce((sum, order) => {
            const cartItems = JSON.parse(order.cartItems);
            return sum + cartItems
                .filter(item => vendorItemIds.includes(item.item_id))
                .reduce((subtotal, item) => subtotal + item.item_total, 0);
        }, 0);

        return res.status(200).json({ status: "success", todayRevenue });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getOrderHistoryByVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        console.log('Requested Vendor ID:', vendorId);

        const vendorItemIds = await Menu.findAll({
            where: { addedBy: vendorId },
            attributes: ["id", "name"],
            raw: true,
        });

        const itemIdMap = new Map();
        vendorItemIds.forEach(item => itemIdMap.set(item.id, item.name));

        if (itemIdMap.size === 0) {
            return res.status(200).json({ success: true, data: [] });
        }
        const allOrders = await Order.findAll();
        const result = [];

        for (const order of allOrders) {
            const items = typeof order.cartItems === 'string' ? JSON.parse(order.cartItems) : order.cartItems;

            const vendorItems = items.filter(item => itemIdMap.has(item.item_id)).map(item => ({ ...item,
                menuName: itemIdMap.get(item.item_id) || item.item_name
            }));

            if (vendorItems.length > 0) {
                const vendorTotal = vendorItems.reduce((sum, item) => sum + parseFloat(item.item_total), 0);

                result.push({
                    orderId: order.id,
                    orderDate: order.order_date,
                    status: order.status,
                    totalAmount: vendorTotal,
                    shippingInfo:order.shippingInfo,
                    vendorItems
                });
            }
        }

        return res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error('Error fetching vendor order history:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



module.exports = { upload, orderHistory, fetchOrderHistory, fetchOrderHistoryById, countTotalOrders, countTotalRevenue, countTodayOrders, countTodayRevenue, getOrderStatus, UpdateOrderStatus, cancelOrderAndRefund, getOrderHistoryByVendor };



