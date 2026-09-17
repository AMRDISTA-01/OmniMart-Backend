const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cart.controller")
const verifyToken = require("../middlewares/auth.middleware")
router.use(verifyToken)

router.post("/",cartController.addToCart)
router.get("/",cartController.getCart)
router.patch("/:productId",cartController.updateQuantity)
router.delete("/:productId",cartController.removeProduct)
router.delete("/",cartController.clearCart)

module.exports=router