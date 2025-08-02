import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchCategoryApi } from "../../../Admin/AdminApi/adminApi";

export default function VendorMenuItemFormModal({ isOpen, onClose, item, onSave }) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        image: null,
        preview: "",
        price: "",
        category: "",
        status: "Available",
        description: "",
    });

    useEffect(() => {
        if (item) {
            setFormData({
                ...item,
                status: item.active ? "Available" : "Inactive",
                image: null,  // Initially null, will be populated if user uploads a new file
                preview: item.image || "",
                existingImage: item.image || "" // Store the existing image path
            });

        } else {
            setFormData({
                name: "",
                image: null,
                preview: "",
                price: "",
                category: "",
                status: "Available",
                description: "",
            });
        }
    }, [item]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        console.log("fetching Category.....")
        const data = await fetchCategoryApi();
        setCategories(data.category);
        console.log("fetched category:", data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = {
            id: item?.id,
            name: formData.name,
            price: formData.price,
            category: formData.category,
            status: formData.status,
            description: formData.description,
            image: formData.image,  // This is the File object
            existingImage: formData.existingImage
        };
        onSave(values);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-none bg-opacity-50 bg-blend-color-burn flex items-center justify-center z-50">
            <div className="bg-gray-100 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold mb-4">
                    {item ? "Edit Menu Item" : "Add Menu Item"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-md"
                            />
                            {formData.preview && (
                                <div className="mt-2">
                                    <img
                                        src={formData.existingImage ? `${import.meta.env.VITE_baseUrl}${formData.existingImage}` : formData.preview}
                                        alt="Preview"
                                        className="h-24 rounded-md object-cover"
                                    />
                                    {item && !formData.image && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Using existing image. Upload a new one to replace.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                                    <option value="">Select Category</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.category_name}>{category.category_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                            >
                                <option value="Available">Available</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            {item ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}