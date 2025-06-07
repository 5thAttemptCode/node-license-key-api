const jwt = require("jsonwebtoken")

// Load secret jwt from .env file
const JWT_SECRET = process.env.JWT_SECRET

// Middlware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.get("authorization")

  if(!authHeader){
    return res.status(401).json({
      error: true,
      message: "Authorization header missing"
    })
    // authHeader is used to extract the Authorization from the header of an http request.
    // Header has an array that holds the authentication scheme - Bearer - and the token.
    // split()[1] seperates the two elements and accesses the second one (token)
  }

  const token = authHeader.split(" ")[1]

  if(!token){
    return res.status(401).json({
      error: true,
      message: "Token not provided"
    })
  }

  try{
    // Verfy token using jwt secret
    const decoded = jwt.verify(token, JWT_SECRET)
    // Attach devoded payload to request - adminId, adminName
    req.admin = decoded
    // Conitnue to next route
    next()
  } catch(err){
    return res.status(403).json({
      error: true,
      message: "Invalid or expired token"
    })
  }
}

module.exports = verifyToken