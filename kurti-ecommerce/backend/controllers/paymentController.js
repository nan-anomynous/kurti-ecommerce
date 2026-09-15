const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc Create a Razorpay order + our internal Order (unpaid)
// @route POST /api/payment/create-order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Create our internal order record (unpaid till verified)
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      razorpayOrderId: razorpayOrder.id,
      isPaid: false,
    });

    res.status(201).json({
      razorpayOrder,
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify Razorpay payment signature after checkout
// @route POST /api/payment/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    // Reduce stock for each item
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeEntry = product.sizes.find((s) => s.size === item.size);
        if (sizeEntry) {
          sizeEntry.stock = Math.max(0, sizeEntry.stock - item.quantity);
        }
        await product.save();
      }
    }

    res.json({ message: "Payment verified successfully", order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
