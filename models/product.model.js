const mongoose = require("mongoose")
const ProductSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required: [true, "Please, enter the title of the product"],
            minlength: [3, "Title must be at least 3 characters long"],
            maxlength: [150, "Title must not exceed 150 characters"]
        },
        description:{
            type:String,
            required: [true, "Please, enter the description of the product"],
            minlength: [20, "Description must be at least 20 characters long"],
            maxlength: [2000, "Description must not exceed 2000 characters"]
        },
        price:{
            type:Number,
            required: [true, "Please, enter the price of the product"],
            min: [0.01, "Price must be greater than 0"]
        },
        image: {
            type: String,
            required: [true, "Please, enter the image URL"]
        },
        category: {
            type: String,
            required: [true, "Please, enter the category of the product"],
            minlength: [2, "Category must be at least 2 characters long"],
            maxlength: [50, "Category must not exceed 50 characters"]
        },
        stock: {
            type: Number,
            required: [true, "Please, enter the stock quantity"],
            min: [0, "Stock cannot be negative"]
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Product creator is required"]
        }

    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model("Product",ProductSchema)