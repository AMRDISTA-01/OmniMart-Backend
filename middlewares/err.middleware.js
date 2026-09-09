module.exports=(err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        place:"err in middleware",
        msg:err.message
    })
}