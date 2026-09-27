const mongoose = require("mongoose");

const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, enum: ["S", "M", "L", "XL", "XXL"], required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["long", "short"], required: true }, // long kurti / short kurti
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    color: { type: String, required: true },
    fabric: { type: String },
    images: [{ type: String, required: true }],
    sizes: [sizeStockSchema],
    category: { type: String, default: "kurti" },
    isFeatured: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
