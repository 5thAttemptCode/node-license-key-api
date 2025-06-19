require('dotenv').config()
const request = require("supertest")
const app = require("../app")
const server = require("../index")
const jwt = require("jsonwebtoken")

const { JWT_SECRET } = process.env


// POST
describe("POST /api/admin/license", () => {
  it("should reject request without token", async () => {
    const response = await request(app)
      .post("/api/admin/license")
      .send({
        key: "TESTKEY-123",
        daysValid: 5
      })
    
    expect(response.statusCode).toBe(401)
    expect(response.body.error).toBe(true)
  })

  it("should reject request with invalid token", async () => {
    const response = await request(app)
    .post("/api/admin/license")
    .set("Authorization", "Bearer invalid.token.here")
    .send({
      key: "INVALIDKEY-123",
      daysValid: 5
    })

    expect(response.statusCode).toBe(403)
    expect(response.body.error).toBe(true)
  })
})


// DELETE
describe("DELETE /api/admin/license", () => {
  it("should reject deletion without token", async () => {
    const response = await request(app)
      .delete("/api/admin/license")
      .send({
        key: "TESTKEY-123"
    })

    expect(response.statusCode).toBe(401)
    expect(response.body.error).toBe(true)
  })

  it("should reject deletion with invalid token", async () => {
    const response = await request(app)
      .delete("/api/admin/license")
      .set("Authorization", "Bearer invalid.token")
      .send({
        key: "TESTKEY-123"
      })

    expect(response.statusCode).toBe(403)
    expect(response.body.error).toBe(true)
  })
})


// GET
describe("GET /api/admin/license", () => {
  it("should reject request without token", async () => {
    const res = await request(app)
      .get("/api/admin/license")
    
    expect(res.statusCode).toBe(401)
    expect(res.body.error).toBe(true)
  })

  it("should reject request with invalid token", async () => {
    const res = await request(app)
      .get("/api/admin/license")
      .set("Authorization", "Bearer invalid.token.here")

    expect(res.statusCode).toBe(403)
    expect(res.body.error).toBe(true)
  })

  it("should allow request with valid token", async () => {
    const validToken = jwt.sign(
      {
        adminId: 1,
        adminName: "TestName"
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    )

    const res = await request(app)
      .get("/api/admin/license")
      .set("Authorization", `Bearer ${validToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.licenses)).toBe(true)
  })
})

// Clean shutdown to avoid worker leaks
afterAll((done) => {
  if(app && app.close){
    server.close(done)
  } else{
    done()
  }
})