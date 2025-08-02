const { DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');

const User = sequelize.define('tbl_User', {
    id: { type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: { type: DataTypes.STRING, 
            allowNull: false, 
            unique: true 
        },
    mobileNo:{
        type:DataTypes.STRING,
        allowNull:false,
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
    isVerified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
    },
});

module.exports = User;
