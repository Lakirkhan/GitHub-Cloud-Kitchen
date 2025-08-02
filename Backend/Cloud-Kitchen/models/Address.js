const { DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');

const Address = sequelize.define('tbl_Address',{
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    recipient_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull:false
    },
    address:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    },
    state:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pincode:{
        type:DataTypes.INTEGER,
        allowNull:false
    }, 
});
module.exports = Address;