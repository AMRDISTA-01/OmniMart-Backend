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
module.exports={
    addToCart
}