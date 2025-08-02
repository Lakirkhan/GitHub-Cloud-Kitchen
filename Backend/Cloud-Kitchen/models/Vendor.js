const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');

const Vendor = sequelize.define('tbl_vendor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resetCode:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    otpCode:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    status: {
        type: DataTypes.ENUM("pending", "approved"),
        allowNull: false,
        defaultValue: "pending"
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rating_count: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    total_rating: { 
        type: DataTypes.FLOAT, 
        defaultValue: 0 
    },
    average_rating: { 
        type: DataTypes.FLOAT, 
        defaultValue: 0 },
}, {
    timestamps: true
});
module.exports = Vendor;

const Menu = require('../models/Menu');
Vendor.hasMany(Menu, { foreignKey: 'addedBy' });

