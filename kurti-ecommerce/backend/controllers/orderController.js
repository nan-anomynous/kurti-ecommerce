const Order = require("../models/Order");

// @desc Get logged-in user's orders
// @route GET /api/orders/myorders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc Get single order by id
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Only owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders (admin)
// @route GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.orderStatus = orderStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
