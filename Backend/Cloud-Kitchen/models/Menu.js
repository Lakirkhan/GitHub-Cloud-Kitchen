const { DataTypes } = require('sequelize');
const sequelize = require('../db/Connection');
const Category = require('../models/Category');


const Menu = sequelize.define('tbl_Menu',{
    id: { type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Category,key: 'id'},
        onDelete: 'CASCADE'
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    order_count:{
        type:DataTypes.INTEGER,
        defaultValue: 0,
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
    addedBy: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    reviews: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
});
module.exports = Menu;

const Vendor = require('./Vendor');
Menu.belongsTo(Vendor, { foreignKey: 'addedBy' });
