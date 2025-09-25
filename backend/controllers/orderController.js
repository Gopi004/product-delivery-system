const pool = require("../db/db");

const createOrder = async (req, res) => {
  const { cartItems } = req.body;
  const customerId = req.user.id;

  if (!cartItems || cartItems.length < 1) {
    return res.status(400).json({ message: "No items in cart" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

  
    for (const item of cartItems) {
      const [stockRows] = await connection.query(
        "SELECT stock FROM products WHERE product_id = ?",
        [item.product_id]
      );

      if (stockRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          message: `Product with ID ${item.product_id} not found`,
        });
      }

      const currentStock = stockRows[0].stock;
      if (currentStock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`,
        });
      }
    }

   
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const [orderResult] = await connection.query(
      "INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)",
      [customerId, totalAmount]
    );
    const orderId = orderResult.insertId;

    const orderDetailsValues = cartItems.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);

    await connection.query(
      "INSERT INTO orderdetails (order_id, product_id, quantity, price) VALUES ?",
      [orderDetailsValues]
    );

    
    for (const item of cartItems) {
      await connection.query(
        "UPDATE products SET stock = stock - ? WHERE product_id = ?",
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error, failed to create order." });
  } finally {
    connection.release();
  }
};

module.exports = { createOrder };
