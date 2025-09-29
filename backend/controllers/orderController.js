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

const getDealerOrders = async (req, res) => {
  const dealerId = req.user.id;
  console.log("getDealerOrders called for dealerId:", dealerId);

  try {
    const [orders] = await pool.query(
      `
            SELECT DISTINCT
                o.order_id,
                o.order_date,
                o.status,
                o.total_amount,
                c.name AS customer_name,
                c.email AS customer_email,
                c.address AS customer_address,
                c.phone AS customer_phone
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN orderdetails od ON o.order_id = od.order_id
            JOIN products p ON od.product_id = p.product_id
            WHERE p.dealer_id = ?
            ORDER BY o.order_date DESC;
        `,
      [dealerId]
    );

    
    for (let order of orders) {
      const [items] = await pool.query(
        `
        SELECT 
          p.name as product_name,
          od.quantity,
          od.price
        FROM orderdetails od
        JOIN products p ON od.product_id = p.product_id
        WHERE od.order_id = ? AND p.dealer_id = ?
      `,
        [order.order_id, dealerId]
      );

      order.items = items;
    }

    console.log(
      "Final orders being sent:",
      orders.map((o) => ({
        id: o.order_id,
        status: o.status,
        itemsCount: o.items.length,
      }))
    );
    res.json(orders);
  } catch (error) {
    console.error("Error fetching dealer orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const assignDelivery = async (req, res) => {
  const dealerId = req.user.id;
  const { personnelId } = req.body;
  const { id: orderId } = req.params;

  if (!personnelId) {
    return res
      .status(400)
      .json({ message: "Delivery personnel ID is required." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderCheck] = await connection.query(
      `
            SELECT o.status FROM orders o
            JOIN orderdetails od ON o.order_id = od.order_id
            JOIN products p ON od.product_id = p.product_id
            WHERE o.order_id = ? AND p.dealer_id = ?
            LIMIT 1;
        `,
      [orderId, dealerId]
    );

    if (orderCheck.length === 0) {
      throw new Error(
        "Order not found or you are not authorized to assign it."
      );
    }

    if (orderCheck[0].status !== "Pending") {
      throw new Error(
        "Order cannot be assigned as it is not in a pending state."
      );
    }

    await connection.query(
      "UPDATE orders SET status='Shipped' WHERE order_id=?",
      orderId
    );

    await connection.query(
      "INSERT INTO deliveries(order_id,personnel_id,status) VALUES (?,?,?)",
      [orderId, personnelId, "Out for Delivery"]
    );

    await connection.query(
      "UPDATE deliverypersonnel SET availability_status = 'On Delivery' WHERE personnel_id = ?",
      [personnelId]
    );

    await connection.commit();
    res.json({ message: "Delivery person assigned successfully." });
  } catch (err) {
    await connection.rollback();
    console.log(err);

    if (
      err.message.includes("not found or not authorized") ||
      err.message.includes("not in a pending state")
    ) {
      return res.status(403).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  } finally {
    connection.release();
  }
};

module.exports = { createOrder, getDealerOrders, assignDelivery };
