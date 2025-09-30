const express= require('express');
const router= express.Router();
const {protect , restrictTo} = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');


router.get("/",productController.getAllProducts);

router.post("/",protect,restrictTo('dealer'),upload,productController.addProduct);
router.get("/my-products",protect,restrictTo('dealer'),productController.getDealerProduct);

router.put("/:id",protect,restrictTo('dealer'),productController.updateProduct);
router.delete("/:id",protect,restrictTo('dealer'),productController.deleteProduct);

module.exports = router;
