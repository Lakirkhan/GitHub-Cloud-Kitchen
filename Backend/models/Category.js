const { DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');
const Menu = require('../models/Menu');

const Category = sequelize.define('tbl_Category',{
    id: { type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    category_name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    category_description:{
        type: DataTypes.STRING,
        allowNull:false
    },
    category_image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    order_count:{
        type:DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM("pending", "approved"),
        allowNull: false,
        defaultValue: "pending"
    }         
});

Category.hasMany(Menu, { foreignKey: 'category_id' });
module.exports = Category;