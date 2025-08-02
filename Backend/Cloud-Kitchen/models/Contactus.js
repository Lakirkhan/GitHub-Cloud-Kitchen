const { DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');

const Contact = sequelize.define('tbl_Contact',{
    id: { type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    subject:{
        type:DataTypes.STRING,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    }
        
    
});
module.exports = Contact;