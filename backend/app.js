const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes= require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require("./routes/orderRoutes")
const deliveryRoutes = require("./routes/deliveryRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/delivery",deliveryRoutes);


const PORT= process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});