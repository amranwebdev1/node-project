/*const jwt = require('jsonwebtoken')
require('dotenv').config()
const checkLogin = (req,res,next)=>{
  const {authorization} = req.headers;
  try{
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token,process.env.JWT_KEY)
    const {name,id} = decoded;
    req.name = name
    req.id = id
    next()
  }catch(err){
    console.log("Athontication faild",err.message)
  }
}
module.exports = checkLogin*/
const jwt = require('jsonwebtoken')

const checkLogin = (req, res, next) => {
  const authHeader = req.headers.authorization; // আগের মতো destructure না করে

  // 1️⃣ হেডার আছে কিনা আগে চেক করো
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  try {
    // 2️⃣ টোকেন স্প্লিট করো
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // 3️⃣ টোকেন verify করো
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // 4️⃣ ডেটা রিকোয়েস্টে রাখো
    req.name = decoded.name;
    req.id = decoded.id;

    next();
  } catch (err) {
    console.error("Authentication failed:", err.message);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = checkLogin;