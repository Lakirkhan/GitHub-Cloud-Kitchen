const { DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');

const Order = sequelize.define('tbl_Order',{
    id: { type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    addedby:{
        type:DataTypes.INTEGER,
        allowNull:false
    } ,
    cartItems:{
        type:DataTypes.JSON,
        allowNull:false,
    },
    billingInfo:{
        type:DataTypes.JSON,
        allowNull:false,
    },
    shippingInfo:{
        type:DataTypes.JSON,
        allowNull:false,
    },
    paymentMethod:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    item_total:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    status:{
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'delivered', 'cancelled', 'refunded'),
        allowNull:false,
        defaultValue: 'pending'
    },
    order_date:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    },
    cancel_reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refund_status: {
        type: DataTypes.ENUM('pending', 'initiated', 'completed', 'failed'),
        allowNull: true,
    },
    refund_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
});
module.exports = Order;