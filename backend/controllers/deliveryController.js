const pool = require("../db/db");

const getMyDeliveries = async (req, res) => {
  const personnelId = req.user.id;
  try {
    const [deliveries] = await pool.query(
      `
            SELECT 
                d.delivery_id,
                o.order_id,
                o.order_date,
                c.name AS customer_name,
                c.address AS customer_address,
                c.phone AS customer_phone
            FROM deliveries d
            JOIN orders o ON d.order_id = o.order_id
            JOIN customers c ON o.customer_id = c.customer_id
            WHERE 
                d.personnel_id = ? AND
                d.status = 'Out for Delivery'
            ORDER BY o.order_date ASC;
        `,
      [personnelId]
    );

    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateDeliveryStatus = async (req, res) => {
  const { id: deliveryId } = req.params;
  const { status } = req.body;
  const personnelId = req.user.id;

  if (!status) {
    return res.status(400).json({ message: "Status is required." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [deliveryUpdateResult] = await connection.query(
      "UPDATE deliveries SET status=?, delivery_date=NOW() WHERE delivery_id=? AND personnel_id=?",
      [status, deliveryId, personnelId]
    );

    if (deliveryUpdateResult.affectedRows === 0) {
      throw new Error("Delivery not found or not authorized to update.");
    }

    if (status == "Delivered") {
      const [order] = await connection.query(
        "SELECT order_id from deliveries where delivery_id=?",
        [deliveryId]
      );

      const orderId = order[0].order_id;
      await connection.query(
        "UPDATE orders SET status='Delivered' WHERE order_id=?",
        [orderId]
      );

      await connection.query("UPDATE deliverypersonnel SET availability_status='Available' WHERE personnel_id=?",[personnelId]);
    }

    await connection.commit();
    res.json({ message: "Delivery status updated successfully." });
  } catch (err) {
    await connection.rollback();
    console.error(err);

    if (err.message.includes("not found or not authorized")) {
      return res.status(404).json({ message: err.message });
    }

    res.status(500).json({ message: "Server Error" });
  } finally {
    connection.release();
  }
};


const getDeliveryHistory = async (req,res) =>
{
  const personnelId= req.user.id;
  try
  {
   const [history] = await pool.query(`
            SELECT 
                d.delivery_id, 
                d.delivery_date, 
                d.status, 
                o.order_id, 
                o.total_amount,
                c.name AS customer_name, 
                c.address AS customer_address,
                c.phone AS customer_phone
            FROM deliveries d 
            JOIN orders o ON d.order_id = o.order_id 
            JOIN customers c ON c.customer_id = o.customer_id 
            WHERE d.personnel_id = ? AND d.status = 'Delivered' 
            ORDER BY d.delivery_date DESC
        `, [personnelId]);
    res.json(history);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

const getDeliveryPersonnel = async (req,res) =>
{
  try
  {
  const [personnel]= await pool.query("SELECT personnel_id,name from deliverypersonnel WHERE availability_status = 'Available'");
  res.json(personnel);
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { updateDeliveryStatus, getMyDeliveries , getDeliveryPersonnel , getDeliveryHistory};
