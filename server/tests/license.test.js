const request = require("supertest")
const app = require("../index")

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

// Clean shutdown to avoid worker leaks
  afterAll((done) => {
    if (app && app.close) {
      app.close(done)
    } else {
      done()
    }
  })