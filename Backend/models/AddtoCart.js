const { DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');

const AddtoCart = sequelize.define('tbl_AddtoCart',{
    id: { type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    item_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    item_name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    item_price:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    item_qty:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    item_image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    item_total:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    addedby:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category_name:{
        type:DataTypes.STRING,
        allowNull:false
    } 
});
module.exports = AddtoCart;