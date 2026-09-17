const mongoose = require("mongoose")
const dotenv = require("dotenv")
const express = require("express")
const cors = require("cors")
dotenv.config({path:".env"})
const app = express()

mongoose
    .connect(process.env.mongourl)
    .then(()=> console.log("connected DB"))
    .catch((err)=>console.log(err))

app.use(cors())
app.use(express.json());

const errMiddleWare = require("./middlewares/err.middleware")
app.use(errMiddleWare)

const authRouter = require("./routes/auth.route")
app.use("/api/auth", authRouter)

const productRouter = require("./routes/product.route")
app.use("/api/product",productRouter)

const cartRouter = require("./routes/cart.route")
app.use("/api/cart",cartRouter)

const orderRouter = require("./routes/order.route")
app.use("/api/order",orderRouter)

app.listen(process.env.port,"127.0.0.1",()=>{
    console.log(`server is running on port ${process.env.port}`)
})