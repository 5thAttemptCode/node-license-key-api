const app = require("./app")

const PORT = 3000


const server = app.listen(PORT, () => {
  console.log(`✅ License server is running at http://localhost:${PORT}`)
})

// Export file for Jest/Supertest
module.exports = server

// Jest doesnt need the server running, it uses the app-object directly
// But in prodution "node index.js" will still start the server as wanted
// require.main === module - Ensures server only starts if index.js is run directly
if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...")
  })
}