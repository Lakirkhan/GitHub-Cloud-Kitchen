const multer = require('multer');
const path = require('path');
const Category = require('../models/Category');
// const Menu = require('../models/Menu');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'category/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });

const upload = multer({ storage: storage });

exports.addCategory = async(req,res)=>{
    try{
        const { category_name, category_description } = req.body;

        if(!category_name || !category_description || (!req.file)){
            return res.status(400).json({"message":"All Fields Are Required"});
        }
        
        console.log("req.role:-",req.user.role);
        let status = (req.user.role === 1 ) ? 'approved' : 'pending';

        const imagePath = `/category/${req.file.filename}`;

        const newCategory = await Category.create({
            category_name:category_name,
            category_description:category_description,
            category_image:imagePath,
            status: status
        });
        return res.status(201).json({ status:"success", message: 'Category Add SuccessFully', category:newCategory });
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

exports.fetchCategory = async(req,res)=>{
    try{
        const category = await Category.findAll({ where: { status:"approved" }});
        return res.status(201).json({category:category})
    }
    catch(error){
        return res.status(404).json({error:error.message})
    }
}

exports.updateCategory = async(req,res)=>{
    try{
        const { id, category_name, category_description } = req.body;
        
        const CategoryItem = await Category.findOne({ where: { id:id } });
        if(!CategoryItem){
            return res.status(404).json({message:"Category Not Found"});
        }

        await Category.update({ category_name, category_description,
                category_image: req.file ? `/category/${req.file.filename}` : CategoryItem.category_image
            },
            { where: { id } }
        );
        
        return res.status(200).json({ message: "Category updated successfully" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.getVendorCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { status: 'pending' },
            attributes: ['id','category_name',"category_description","category_image","status"]  
        });

        return res.status(200).json({ status:"success",categories: categories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error while fetching category requests" });
    }
};


exports.reviewCategory = async (req, res) => {
    try {
        const { categoryId, action } = req.body; // action should be "approve" or "reject"

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (category.status === 'approved') {
            return res.status(400).json({ message: "Category is already approved" });
        }

        if (action === 'approved') {
            category.status = 'approved';
            await category.save();
            return res.status(200).json({ message: "Category approved successfully" });
        } else if (action === 'reject') {
            await category.destroy(); // Delete category if rejected
            return res.status(200).json({ message: "Category rejected and deleted successfully" });
        } else {
            return res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
exports.upload = upload.single('category_image');