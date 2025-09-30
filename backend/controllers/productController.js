const pool = require("../db/db");

const getAllProducts= async (req,res) =>{
  try{
  const [products] = await pool.query("SELECT product_id,name,description, price,stock FROM products WHERE stock>0");
  res.json(products);
  }
  catch(error)
  {
    res.status(500).json({message : "Server Error"});
  }
};

const getDealerProduct = async (req,res) =>{
  try{
    const dealer_Id=req.user.id;
    const [products]= await pool.query("SELECT * from products where dealer_id=?",[dealer_Id]);
    res.json(products);
  }
  catch(error)
  {
    res.status(500).json({message : "Server Error"});
  }
};

const addProduct = async (req,res) =>
{
  const {name , description , price ,stock } = req.body;
  const dealer_Id=req.user.id;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try
  {
    const [result]= await pool.query("INSERT INTO products(dealer_id,name,description, price , stock,image_url) VALUES(?,?,?,?,?,?)",[dealer_Id,name,description,price,stock,imageUrl]);
     res.status(201).json({ message: "Product added", productId: result.insertId });
  }
  catch(error)
  {
     res.status(500).json({message : "Server Error"});
  }
};

const updateProduct = async (req,res) =>
{
  const {id}=req.params;
  const {name , description , price ,stock } = req.body;
  const dealer_Id=req.user.id;
  try
  {
    const [result] = await pool.query("UPDATE products SET name=?,description=?,price=?,stock=? WHERE dealer_id=? AND product_id=?",[name, description, price, stock, dealer_Id, id ]);
     if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found or not authorized." });
      res.json({ message: "Product updated" });
  }
  catch(error)
  {
     res.status(500).json({ message: "Server Error" });
  }
};

const deleteProduct = async (req,res) =>
{
  const {id}=req.params;
   const dealer_Id=req.user.id;
   try
   {
    const [result]= await pool.query("DELETE FROM products WHERE dealer_id=? AND product_id=?",[dealer_Id,id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found or not authorized." });
      res.json({ message: "Product deleted" });
   }
   catch(error)
   {
      res.status(500).json({ message: "Server Error" });
   }
}

module.exports = {deleteProduct,updateProduct,getAllProducts,getDealerProduct,addProduct};

