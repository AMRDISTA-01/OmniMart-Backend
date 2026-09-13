const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const addToCart = async(req,res,next)=>{
    try{
        const {productId,quantity=1} = req.body
        const product = await Product.findById(productId)
        const parseQuantity = parseInt(quantity)
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }

        let cart = await Cart.findOne({
            userId:req.user.id
        })
        if(!cart){
            cart = await Cart.create({
                userId:req.user.id,
                products:[{
                    productId,
                    quantity:parseQuantity
                }]
            })
            return res.status(201).json({
                message:"product added to cart successfully"
            })
        }
        const existingProduct = cart.products.find(
            (item)=> item.productId.toString() === productId
        )
        if(existingProduct){
            existingProduct.quantity += parseQuantity
        }
        else{
            cart.products.push({
                productId,
                quantity:parseQuantity
            })
        }
        await cart.save()

        return res.status(200).json({
            success:true,
            message:"product added to cart successfully",
            cart
        })
    }
    catch(err){
        next(err)
    }
}
const getCart = async (req,res,next) => {
    try{
        const id = req.user.id
        const cart = await findOne({id}).populate('products.productId')
        if(cart){
            return res.status(200).json({
                success:true,
                cart
            })
        }
        else{
            return res.status(404).json({
                success:false,
                message:"cart not found"
            })
        }
    }
    catch(err){
        next(err)
    }
    
}
const updateQuantity = async (req,res,next)=>{
    try{
        const id = req.user.id
        const cart = await findOne({id})
        if(!cart){
            return res.status(404).json({
                success:false,
                message:"cart not found"
            })
        }
        const product = await cart.products.find((item)=>item.productId.toString()===req.params.productId)
        if(product){
            product.quantity = parseInt(req.body.quantity)
            await cart.save()
            return res.status(200).json({
                success:true,
                message:"update is successful"
            })
        }
        else{
            return res.status(404).json({
                success:false,
                message:"product not found"
            })
        }
    }
    catch(err){
        next(err)
    }
}
const removeProduct = async (req,res,next)=>{
    try{
        const id = req.user.id
        const cart = await findOne({id})
        if(!cart){
            return res.status(404).json({
                success:false,
                message:"cart not found"
            })
        }
        const product = await cart.products.find((item)=>item.productId.toString()===req.params.productId)
        if(product){
            cart.products = cart.products.filter(
                (e)=>e.productId.toString() !== req.params.productId
            )
            await cart.save()
            return res.status(200).json({
                success:true,
                message:"product removed"
            })
        }
        else{
            return res.status(404).json({
                success:false,
                message:"product not found"
            })
        }
    }
    catch(err){
        next(err)
    }
}
const clearCart = async (req,res,next)=>{
    try{
        const id = req.user.id
        const cart = await findOne({id})
        if(!cart){
            return res.status(404).json({
                success:false,
                message:"cart not found"
            })
        }
        cart.products = [];
		await cart.save();

		return res.status(200).json({
			success: true,
			message: "Cart cleared successfully",
		});
    }
    catch(err){
        next(err)
    }
}
module.exports={
    addToCart,
    getCart,
    updateQuantity,
    removeProduct,
    clearCart
}