const mongoose =require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please Enter Your Name"],
            trim: true,
            minLength: [3, "Name Must Be Atleast 3 Characters"],
            maxLength: [50, "Name Can't Exceed 50 Characters"]
        },
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                "Please enter a valid email address"
            ]
        },
        password: {
            type: String,
            required: [true, "Please Enter Your Password"],
            minLength: [8, "Password Must Be Atleast 8 Characters"],
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ]
        },
        confirmpassword: {
            type: String,
            required: [true, "Please Confirm The Password"]
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart"
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ]
    },
    {
        timestamps: true
    }
)
UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    if(this.password !== this.confirmpassword){
        throw Error("password and confrimpassword do not match")
    }
    this.password = await bcrypt.hash(this.password,8)
    this.confirmpassword = undefined
})
UserSchema.methods.comparepassword = async function (userPassword){
    return await bcrypt.compare(userPassword,this.password)
}
module.exports = mongoose.model("User", UserSchema);