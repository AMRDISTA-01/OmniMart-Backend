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
            return Product.findByIdAndUpdate(
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
        await Cart.findByIdAndDelete({userId})
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
module.exports = {
    checkout
}