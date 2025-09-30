const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');


router.get("/mydeliveries",protect,restrictTo('delivery'),deliveryController.getMyDeliveries);
router.put("/deliveries/:id/status",protect,restrictTo('delivery'),deliveryController.updateDeliveryStatus);
router.get("/delivery-history",protect,restrictTo('delivery'),deliveryController.getDeliveryHistory);

router.get("/delivery-personnel",protect,restrictTo('dealer'),deliveryController.getDeliveryPersonnel);

module.exports = router;