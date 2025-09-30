const express= require("express");
const router= express.Router();
const orderController = require("../controllers/orderController");
const {protect, restrictTo} = require("../middleware/authMiddleware");

router.post("/",protect,restrictTo('customer'),orderController.createOrder);
router.get("/customer-orders",protect,restrictTo('customer'),orderController.getCustomerOrders);

router.get("/dealer-orders",protect,restrictTo('dealer'),orderController.getDealerOrders);
router.put("/:id/assign",protect,restrictTo('dealer'),orderController.assignDelivery);

module.exports= router;