const Order = require("../models/order.model")
const Cart = require("../models/cart.model")
const Product = require("../models/product.model")

const checkout = async(req,res,next)=>{
    try{
        const {customerInfo,paymentMethod="Cash on Delivery"}=req.body
        const userId = req.user.id
        const cart = await  Cart.findOne({userId}).populate("products.productId")
        if(!cart || cart.products.length === 0){
            return res.status(400).json({
                success:false,
                message:"Cart is empty"
            })
        }
        if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
            return res.status(400).json({
                success: false,
                message: "All customer information fields are required"
            });
        }
        for (const item of cart.products) {
			if (item.quantity > item.productId.stock) {
				return res.status(400).json({
                    success: false,
					message: `Insufficient stock for product: ${item.productId.title}`,
					availableStock: item.productId.stock,
					requestedQuantity: item.quantity,
				});
			}
		}

        let totalprice = 0
        const orderProducts = cart.products.map((item)=>{
            totalprice += item.productId.price * item.quantity
            return {
                productId:item.productId._id,
                quantity:item.quantity,
                price:item.productId.price
            }
        })
        const order = new Order({
            userId,
            products:orderProducts,
            totalPrice:totalprice,
            customerInfo:{
                fullName:customerInfo.fullName.trim(),
                phone:customerInfo.phone.trim(),
                address:customerInfo.address.trim(),
                city:customerInfo.city.trim()
            },
            paymentMethod,
        })
        await order.save()
        const updateStockPromises = cart.products.map((item)=>{
            return Product.findOneAndUpdate(
                {
                    _id:item.productId._id,
                    stock: {$gte:item.quantity}
                },
                {
                    $inc:{ stock: -item.quantity}
                },
                {new:true}
            )
        })
        await Promise.all(updateStockPromises)
        await Cart.findOneAndDelete(userId)
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    }
    catch(err){
        next(err)
    }
}
const getUserOrders = async(req,res,next)=>{
    try{
        const userId = req.user.id
        const orders = await Order.find({userId})
        .populate("products.productId")
        .sort({createdAt:-1})
        res.status(200).json({
            success: true,
            orders
        });
    }
    catch(err){
        next(err)
    }
}
const getOrdersByAdmin = async(req,res,next)=>{
    try{
        const orders = await Order.find()
        .populate("products.productId")
        .sort({createdAt:-1})
        res.status(200).json({
            success: true,
            orders
        });
    }
    catch(err){
        next(err)
    }
}
const getOrderById = async(req,res,next)=>{
    try{
        const orderId = req.params.id
        const order = await Order.findById(orderId)
        .populate("products.productId")
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            })
        }
        if(order.userId.toString() === req.user.id || req.user.role ==='admin'){
            return res.status(200).json({
                success:true,
                order
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:"You are not authorized to view this order"
            })
        }
    }
    catch(err){
        next(err)
    }
}
const updateOrderStatus = async(req,res,next)=>{
    try{
        const orderId = req.params.id
        const {status} = req.body
        if(!status){
            return res.status(400).json({
                success:false,
                message:"Status is required"
            })
        }
        const currentOrder = await Order.findById(orderId)
        if(!currentOrder){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            })
        }
        if (status === "Cancelled" && currentOrder.status !== "Cancelled") {
            const restockPromises = currentOrder.products.map((item) => {
                return Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity }
                });
            });
            await Promise.all(restockPromises);
        }
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status},
            {new:true, runValidators:true}
        )
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Order status updated",
            order
        })
    }
    catch(err){
        next(err)
    }
}
module.exports = {
    checkout,
    getUserOrders,
    getOrdersByAdmin,
    getOrderById,
    updateOrderStatus
}