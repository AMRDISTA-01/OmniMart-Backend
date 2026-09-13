module.exports = admin = (req, res, next) => {
    if(!req.user){
        return res.status(401).json({
            success : false,
            message:"Authentication required"
        })
    }
    if(req.user.role ==="admin"){
        next()
    }
    else{
        return res.status(403).json({ 
            success: false, 
            error: "You are not authorized to access this route" 
        });
    }
}
