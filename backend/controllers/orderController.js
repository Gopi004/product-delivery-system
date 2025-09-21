const pool = require('../db/db');

const createOrder = async (req, res) => {
    const { cartItems } = req.body;
    const customerId = req.user.id;

    if (!cartItems || cartItems.length < 1) {
        return res.status(400).json({ message: 'No items in cart' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        
        const [orderResult] = await connection.query(
            "INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)",
            [customerId, totalAmount]
        );
        const orderId = orderResult.insertId;

        const orderDetailsValues = cartItems.map(item => [orderId, item.product_id, item.quantity, item.price]);

        await connection.query(
            "INSERT INTO orderdetails (order_id, product_id, quantity, price) VALUES ?",
            [orderDetailsValues]
        );

        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', orderId });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to create order.' });
    } finally {
        connection.release();
    }
};

module.exports= {createOrder};