const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const register = async (req,res,next)=>{
    try{
        const{
            name,
            email,
            password,
            confirmpassword
        }=req.body
        const user = new User({
            name,
            email,
            password,
            confirmpassword
        })
        await user.save()
        const token = jwt.sign(
            {
                id:user._id,
                name:user.name,
                role:user.role
            },
            process.env.secret_key,
            { expiresIn: "30m" }
        )
        user.password = undefined
        res.status(201).json({
            success:true,
            msg:"your registration done",
            newuser:user,
            token:token
        })
    }
    catch(err){
        next(err)
    }
}
const login = async (req,res,next)=>{
    try{
        const { email,password} = req.body
        const user = await User.findOne({email})
        if (!user) return res.status(400).json("invalid email");
        if(!(await user.comparepassword(password)))
            return res.status(400).json("wrong password");
        const token = jwt.sign(
            {
                id:user._id,
                name:user.name,
                role:user.role
            },
            process.env.secret_key,
            { expiresIn: "30m" }
        )
        res.status(200).json({ msg: "login done", user: user, token: token });

    }
    catch(err){
        next(err)
    }
}
module.exports = { register,login}