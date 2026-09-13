const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User ID is required"],
			unique: true,
		},

		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: [true, "Product ID is required"],
				},

				quantity: {
					type: Number,
					required: [true, "Quantity is required"],
					min: [1, "Quantity must be at least 1"],
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Cart", CartSchema);
