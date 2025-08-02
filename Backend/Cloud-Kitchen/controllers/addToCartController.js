const AddtoCart = require('../models/AddtoCart');
const Menu = require('../models/Menu');
const { Op } = require('sequelize');

exports.addToCart = async (req, res) => {
    try {
        const { item_id, item_qty } = req.body;
        let fullIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ip = fullIp.match(/(?:\d{1,3}\.){3}\d{1,3}/)?.[0] || fullIp;
        let user_id = req.user ? req.user.id : req.session.user_id || ip;

        console.log("User ID Before Storing:", user_id);
        console.log("Ip:-",ip,typeof(ip));

        if (!user_id) {
            return res.status(500).json({ message: "Error While Fetching Ip-Address" });
        }

        const menuItem = await Menu.findOne({ where: { id: item_id } });

        if (!menuItem) {
            return res.status(404).json({ message: 'Item not found in menu' });
        }

        let item_total = menuItem.price * item_qty;
        
        let cartItem = await AddtoCart.findOne({
            where: { addedby: user_id, item_id: item_id }
        });

        if (cartItem) {
            cartItem.item_qty += item_qty;
            cartItem.item_total = cartItem.item_price * cartItem.item_qty;
            await cartItem.save();
        }
        else {
            cartItem = await AddtoCart.create({
                item_id: menuItem.id,
                item_name: menuItem.name,
                item_price: menuItem.price,
                item_qty: item_qty,
                item_image: menuItem.image,
                item_total: item_total,
                addedby: user_id,
                category_name:menuItem.category,
            });
        }
        if (!req.user) {
            req.session.user_id = ip;
        }
        return res.status(201).json({ status:"success", message: 'Item added to cart', cartItem:cartItem });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// exports.getCartItems = async (req, res) => {
//     try {
//         const user_id = req.verifiedUserId;
//         console.log("user_id:-",user_id);
//         const fullIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//         const requestIp = fullIp.match(/(?:\d{1,3}\.){3}\d{1,3}/)?.[0];
//         console.log("Extracted user_id:", user_id, "Requester's IP:", requestIp);
    
//         if (!user_id) {
//             return res.status(400).json({ message: "User ID not found" });
//         }

//         let whereClause = [{ addedby: user_id }];

//         // If user is logged in, also fetch IP-based items
//         if (user_id !== requestIp) {
//             whereClause.push({ addedby: requestIp });
//         }

//         const cartItems = await AddtoCart.findAll({
//             where: {
//                 [Op.or]: whereClause
//             }
//         });

//         if (!cartItems.length) {
//             return res.status(404).json({ message: "No items in cart" });
//         }

//         return res.status(200).json({ status: "success", cartItems: cartItems });
//     } catch (error) {
//         console.error('Error fetching cart items:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

exports.getCartItems = async (req, res) => {
    try {
        const user_id = req.verifiedUserId;
        console.log("user_id:-", user_id);
        const fullIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Extract IPv4 address safely or fall back to full IP
        const requestIp = fullIp?.match(/(?:\d{1,3}\.){3}\d{1,3}/)?.[0] || fullIp;
        console.log("Extracted user_id:", user_id, "Requester's IP:", requestIp);

        if (!user_id) {
            return res.status(400).json({ message: "User ID not found" });
        }

        let whereClause = [{ addedby: user_id }];

        // Only include IP if it's a valid and different string from user_id
        if (requestIp && requestIp !== user_id && requestIp !== "::1") {
            whereClause.push({ addedby: requestIp });
        }

        const cartItems = await AddtoCart.findAll({
            where: {
                [Op.or]: whereClause
            }
        });

        if (!cartItems.length) {
            return res.status(404).json({ message: "No items in cart" });
        }

        return res.status(200).json({ status: "success", cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateCartQuantity = async (req, res) => {
    try {
        const { item_id, item_qty } = req.body;
        const user_id = req.verifiedUserId;

        if (!item_id || item_qty === undefined) {
            return res.status(400).json({ message: 'Item ID and quantity are required' });
        }

        let cartItem = await AddtoCart.findOne({
            where: { addedby: user_id, item_id: item_id }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (item_qty <= 0) {
            await cartItem.destroy();
            let updatedCart = await AddtoCart.findAll({ where: { addedby: user_id },raw: true });
            // console.log("updatedCart:-",updatedCart)
            return res.status(200).json({ status: "removed", message: 'Item removed from cart', cart: updatedCart });
        }

        cartItem.item_qty = item_qty;
        cartItem.item_total = cartItem.item_price * item_qty;
        await cartItem.save();

        let updatedCart = await AddtoCart.findAll({ where: { addedby: user_id } });

        return res.status(200).json({ status: "success", message: 'Cart updated', cartItem:updatedCart });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const user_id = req.verifiedUserId;
        await AddtoCart.destroy({ where: { addedby: user_id } });

        return res.status(200).json({ status: "success", message: "Cart emptied successfully" });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//4e539609-8818-41ae-b3b7-0b03e9d5eaa9
//4e539609-8818-41ae-b3b7-0b03e9d5eaa9