const secretToken = "ABC123DEF456GHI789"

const verifyToken = (req, res, next) => {
  const authHeader = req.get("authorization")

  if(authHeader){
    // authHeader is used to extract the Authorization from the header of an http request.
    // Header has an array that holds the authentication scheme - Bearer - and the token.
    // split()[1] seperates the two elements and accesses the second one (token)
    const token = authHeader.split(" ")[1]

    if(token === secretToken){
      next()  // Token is valid, proceed to the next middleware/route handler
    } else{
      res.status(403).send("Invalid token")
    }
  } else{
    res.status(401).send("Token required")
  }
}

module.exports = verifyToken