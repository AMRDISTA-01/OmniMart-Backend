const Product = require("../models/product.model")

const creatProduct = async (req,res,next)=>{
    try{
        const{
            title,
            description,
            price,
            stock,
            category,
            image
        }=req.body

        const product = new Product({
            title,
            description,
            price,
            stock,
            category,
            image,
            createdBy:req.user._id
        })

        await product.save()
        await product.populate("createdBy","name email")

        res.status(201).json({
            success:true,
            msg:"product created successfully",
            product
        })
    }
    catch(err){
        next(err)
    }
}
const updateProduct = async(req,res,next)=>{
    try{
        const id = req.params.id
        const {
                title,
                description,
                price,
                stock,
                category,
                image
        } = req.body
        const product = await Product.findByIdAndUpdate(
            id,
            {
                title,
                description,
                price,
                stock,
                category,
                image
            },
            {
                new:true,
                runValidators:true
            }
        ).populate("createdBy","name email")
        if(!product){
            return res.status(404).json({
                success:false,
                msg:"Product not found"
            })
        }

        res.status(200).json({
            success:true,
            msg:"Product updated",
            product
        })
    }
    catch(err){
        next(err)
    }
}
const getProductById = async (req,res,next)=>{
    try{
        const id = req.params.id
        const product = await Product.findById(id)
        if(!product){
            return res.status(404).json({
                success:false,
                msg:"Product not found"
            })
        }
        res.status(200).json({
            success:true,
            msg:"Product found",
            product
        })
    }
    catch(err){
        next(err)
    }
}
const searchProducts = async (req,res,next)=>{
    try{
        const { title , category }= req.query
        const filter  ={}
        if(title){
            filter.title={
                $regex: title,
                $options: "i"
            }
        } 
        if(category){
            filter.category={
                $regex: category,
                $options: "i"
            }
        }
        const products = await Product.find(filter)
        res.status(200).json({
            success:true,
            msg:"Avilable Products",
            products
        })
    }
    catch(err){
        next(err)
    }
}
const deleteProduct = async(req,res,next)=>{
    try{
        const id = req.params.id
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(404).json({
                success:false,
                msg:"Product not found"
            })
        }
        res.status(200).json({
            success:true,
            msg:"Product deleted"
        })
    }
    catch(err){
        next(err)
    }
}
const getAllProducts = async (req,res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            message: "All Products Retrieved Successfully",
            products
        });

    } catch (err) {
        next(err);
    }
};
module.exports={
    creatProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
    getProductById,
    searchProducts
}