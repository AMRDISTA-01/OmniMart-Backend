const jwt = require('jsonwebtoken');
const key = process.env.secret_key
const verifyToken= async(req,res,next)=>{
    const authHeader = req.headers.authorization
    try{
        if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json("token not found please register or login first")
        const token = authHeader.split(' ')[1]
        const payload = jwt.verify(token,key)
        req.user = payload
        return next()
    }
    catch(err){
        return res.status(403).json({ error: "Invalid or expired token" })
    }
}
module.exports = verifyToken