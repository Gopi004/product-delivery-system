const express= require("express");
const router= express.Router();
const orderController = require("../controllers/orderController");
const {protect, restrictTo} = require("../middleware/authMiddleware");

router.post("/",protect,restrictTo('customer'),orderController.createOrder);

module.exports= router;