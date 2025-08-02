const multer = require('multer');
const path = require('path');
const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Vendor = require('../models/Vendor');
const { Op } = require("sequelize");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });

const upload = multer({ storage: storage });

exports.fetchItemById = async(req,res)=>{
    try{
        const { id } = req.body;
        const fetchItemById = await Menu.findAll({where:{ category_id: id}})
        return res.status(200).json({ status:"success",message:"ItemFetched By Id", items:fetchItemById})
    }
    catch(error){
        console.log(error);
        return res.status(404).json({error:error.message});
    }
}

exports.discontinueItem = async (req, res) => {
    try {
        const { id } = req.body;

        const MenuItem = await Menu.findOne({ where: { id } });

        if (!MenuItem) {
            return res.status(404).json({ success: false, message: "MenuItem Not Found" });
        }

        await Menu.update({ active: false }, { where: { id } });

        return res.status(200).json({ status:"success", message: "Item discontinued successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.updatedItem = async(req,res)=>{
    try{
        const { id, name, description, category, price, active}= req.body;
        console.log("body:-",req.body);
        const MenuItem = await Menu.findOne({ where: { id:id } });
        if(!MenuItem){
            return res.status(404).json({message:"MenuItem Not Found"});
        }
        // console.log("Menu:-",MenuItem)
        await Menu.update({ name, description, category, price, active,
            image: req.file ? `/uploads/${req.file.filename}` : MenuItem.image
        },{ where: { id } });
        return res.status(200).json({ status:"success", message: "Item updated successfully" });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


exports.getPaginatedMenuItems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 6;
        const search =req.query.search;
        const category = req.query.category;
        const active = req.query.active ? req.query.active === "true" : undefined;
        const offset = (page - 1) * limit; 

        let where = {};

        if (search) {
            where.description = { [Op.like]: `%${search}%` }; 
        }

        if (category) {
            where.category = category; 
        }

        if(active !== undefined){
            where.active = active;
        }

        const total = await Menu.count({ where });
        const items = await Menu.findAll({ where, order: [['id', 'DESC']], limit, offset });

        return res.status(200).json({ status: "success", total,totalPages: Math.ceil(total / limit), currentPage: page, items:items });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
};


exports.getPopularItems = async (req, res) => {
    try {
        const popularItems = await Menu.findAll({ where: { active: true },
            order: [['order_count', 'DESC']],
            include: [{
                model: Vendor,
                attributes: ['name']
            }],
            limit: 9});

        return res.status(200).json({ status: "success", items: popularItems });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
};


exports.getPopularCategories = async (req, res) => {
    try {
        const popularCategories = await Category.findAll({
            // attributes: ['id', 'category_name', 'order_count'],
            order: [['order_count', 'DESC']],
            limit: 5
        });

        return res.status(200).json({ status: "success", categories: popularCategories });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
};


exports.addRating = async (req, res) => {
    try {
        const { menu_id, rating, message } = req.body;

        if (!menu_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Invalid menu ID or rating. Rating must be between 1 and 5." });
        }

        const menuItem = await Menu.findByPk(menu_id);

        if (!menuItem) {
            return res.status(404).json({ error: "Menu item not found." });
        }

        let reviews = [];

        try {
            reviews = Array.isArray(menuItem.reviews)
                ? menuItem.reviews
                : JSON.parse(menuItem.reviews || '[]');
        } catch (e) {
            reviews = [];
        }

        const newReview = {
            message: message || "",
            rating: parseFloat(rating),
            created_at: new Date().toISOString()
        };

        reviews.push(newReview);

        const currentTotalRating = menuItem.total_rating ? parseFloat(menuItem.total_rating) : 0;
        const currentRatingCount = menuItem.rating_count ? menuItem.rating_count : 0;

        const newTotalRating = currentTotalRating + parseFloat(rating);
        const newRatingCount = currentRatingCount + 1;
        const newAverageRating = parseFloat((newTotalRating / newRatingCount).toFixed(1));

        await Menu.update(
            {
                total_rating: newTotalRating,
                rating_count: newRatingCount,
                average_rating: newAverageRating,
                reviews: reviews
            },
            { where: { id: menu_id } }
        );

        return res.status(201).json({
            status: "success",
            message: "Rating added successfully!",
            menuItem: {
                id: menuItem.id,
                name: menuItem.name,
                average_rating: newAverageRating,
                rating_count: newRatingCount,
                reviews: reviews
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


exports.getMenuRatings = async (req, res) => {
    try {
        const menu_id = parseInt(req.params.menu_id, 10);
        // console.log("menu_id",menu_id);

        const menuItem = await Menu.findByPk(menu_id, {
            attributes: ['id', 'name', 'rating_count', 'average_rating','reviews']
        });
        // console.log("menu_item",menuItem);

        if (!menuItem) {
            return res.status(404).json({ error: "Menu item not found." });
        }

        return res.status(201).json({ 
            status:"success",
            id: menuItem.id,
            name: menuItem.name,
            rating_count: menuItem.rating_count,
            average_rating:menuItem.average_rating !== null ? parseFloat(menuItem.average_rating.toFixed(1)) : 0.0,
            reviews:menuItem.reviews ?? []
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

exports.getAllMenuRatings = async (req, res) => {
    try {
        const menuItems = await Menu.findAll({
            attributes: ['id', 'name', 'rating_count', 'average_rating', 'reviews']
        });

        if (!menuItems || menuItems.length === 0) {
            return res.status(404).json({ error: "No menu items found." });
        }

        const formattedMenu = menuItems.map(item => ({
            id: item.id,
            name: item.name,
            rating_count: item.rating_count ?? 0,
            average_rating: item.average_rating !== null ? parseFloat(item.average_rating.toFixed(1)) : 0.0,
            reviews:item.reviews ?? []
        }));

        return res.status(201).json({ status:"success", formattedMenu:formattedMenu});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error", error });
    }
};


exports.uploadItem = async(req,res)=>{
    try{
        const { name, description, category, price, active } = req.body;
        const user_id = req.user.id;
        console.log("user_id",user_id);
        console.log("body",req.body);
        

        if(!name || !description || !category || !price || !active || (!req.file)){
            return res.status(400).json({"message":"All Fields Are Required"});
        }

        let categoryData = await Category.findOne({ where: { category_name: category } });

        if (!categoryData) {
            return res.status(400).json({ message: "Invalid category. Category not found." });
        }
        const imagePath = `/uploads/${req.file.filename}`;

        const newItem = await Menu.create({
            name:name,
            description:description,
            category:category,
            price:price,
            image:imagePath,
            active:active,
            category_id:categoryData.id,
            addedBy:user_id
        })
        return res.status(201).json({ status:"success", message: 'Item Add SuccessFully', item:newItem });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:error.message});
    }
}
exports.upload = upload.single('image');

exports.getItemsByVendorId = async (req, res) => {
    try {
        // const { vendor_id } = req.params;
        const vendor_id = parseInt(req.params.vendor_id);
        console.log("vendor_id:-",vendor_id,typeof(vendor_id));
        
        const vendor = await Vendor.findByPk(vendor_id);
        if (!vendor) {
            return res.status(404).json({ status: "error", message: "Vendor not found." });
        }

        const menuItems = await Menu.findAll({
            where: { addedBy: vendor_id, active: true },
            order: [['id', 'DESC']]
        });

        return res.status(200).json({ status: "success", items: menuItems });
    } catch (error) {
        console.error("Error fetching vendor items:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


exports.getActiveItem = async (req, res) => {
    try {
        const menu = await Menu.findAll({
            where: { active: true },
            include: [{
                model: Vendor,
                attributes: ['name']
            }],
            order: [['id', 'DESC']]
        });

        return res.status(200).json({status:"success", items:menu})
    } catch (error) {
        console.error("Error fetching active items:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getPopularItemsByVendor = async (req, res) => {
    try {
        const { vendor_id } = req.params;
        const vendor = await Vendor.findByPk(vendor_id);
        if (!vendor) {
            return res.status(404).json({ status: "error", message: "Vendor not found." });
        }

        const popularItems = await Menu.findAll({
            where: { addedBy: vendor_id, active: true },
            attributes: ["id","name","order_count","image","price"],
            order: [['order_count', 'DESC']],
            limit: 8
        });

        return res.status(200).json({ status: "success", items: popularItems });
    } catch (error) {
        console.error("Error fetching popular items by vendor:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const MenuItem = await Menu.findOne({ where: { id } });

        if (!MenuItem) {
            return res.status(404).json({ success: false, message: "MenuItem Not Found" });
        }

        await Menu.destroy({ where: { id: id } });

        return res.status(200).json({ status:"success", message: "Item Deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.getItembyCategory = async (req, res) => {
    try {
      const { category_name } = req.params;
  
      if (!category_name) {
        return res.status(400).json({ message: "Category Name is required" });
      }
  
      const menuItems = await Menu.findAll({
        include: [
          {
            model: Category,
            where: { category_name }
          },
        ],
        where: { active: true },
        order: [['id', 'DESC']],
      });
  
      if (menuItems.length === 0) {
        return res.status(404).json({ message: "No items found in this category" });
      }
  
      return res.status(200).json({
        message: "Menu items fetched successfully",
        menuItems,
      });
    } catch (error) {
      console.error("Error fetching items by category:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  