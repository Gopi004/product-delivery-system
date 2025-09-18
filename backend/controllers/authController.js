const pool=require('../db/db');
const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken");

const registerUser=  async (req,res) => {
  const {role} = req.params;
  const {name,email,phone,address,password} = req.body;

  const tableMap = {
    customer:"customers",
    dealer: "dealers",
    delivery:"deliverypersonnel"
  };

  const tableName=tableMap[role];
  if(!tableName)
  {
    return res.status(400).json({message: "Invalid User role specified"});
  }
  
  try
  {
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);

    await pool.query(`INSERT INTO ${tableName} (name,email,phone,address,password_hash) VALUES(?,?,?,?,?)`, [name,email,phone,address,hashedPassword])
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
  }
  catch(err)
  {
    console.log(err);
    return res.status(500).json({message :" Server Error"});
  }
};

const loginUser= async (req,res) => {
  const {role} = req.params;
  const {email,password}= req.body;

  const tableMap={
    customer:{ table: 'customers', idColumn:'customer_id'},
    dealer: {table: 'dealers', idColumn:'dealer_id'},
    delivery:{table: 'deliverypersonnel',idColumn:'personnel_id'}
  };

  const userInfo=tableMap[role];
  if (!userInfo)
  {
    return res.status(400).json({message: "Invalid user role specified"});
  }

  try
  {
    const [rows]= await pool.query(`SELECT * FROM ${userInfo.table} WHERE email=?`,[email]);

    if (rows.length === 0) 
    {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch)
    {
      return res.status(400).json({message: "Invalid Credentials"});
    }

    const payload={
      id:user[userInfo.idColumn],
      role:role
    };

    const token= jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '24h'});
  
    res.status(200).json({ message: "Login successful", token });

  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({message: "something went wrong"});
  }
};

module.exports={loginUser,registerUser};