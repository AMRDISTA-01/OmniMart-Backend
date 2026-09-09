const mongoose = require("mongoose")
const OrderSchema = mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:[true,"User ID is required"]
        },
        products:[
            {
                productId:{
                    type:mongoose.Schema.ObjectId,
                    ref:"Product",
                    required:[true,"Product ID required"]
                },
                quantity:{
                    type:Number,
                    min:[1,"Quantity must be at least 1"],
                    required:[true,"Quantity is required"]
                },
                price: {
                    type: Number,
                    required: [true, "Price is required"],
                }
            }
        ],
        totalPrice:{
            type:Number,
            required: [true, "Total price is required"],
        },
        customerInfo:{
            fullName:{
                type:String,
                required: [true, "Full name is required"],
                trim: true,
            },
            phone: {
                type: String,
                required: [true, "Phone number is required"],
                trim: true,
            },
            address: {
                type: String,
                required: [true, "Address is required"],
                trim: true,
            },
            city: {
                type: String,
                required: [true, "City is required"],
                trim: true,
            },
        },
        paymentMethod: {
            type: String,
            enum: ["Cash on Delivery"],
            required: [true, "Payment method is required"],
            default: "Cash on Delivery",
        },
        status: {
            type: String,
            enum: [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
            ],
            default: "Pending"
        },
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Order",OrderSchema)