// tests/bearer.spec.js
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

test.describe(
  "Authentication: Dynamic Bearer Token Suite",
  { tag: ["@token"] },
  () => {
    let token;

    test.beforeAll(() => {
      const tokenFile = path.resolve(__dirname, "../.auth/token.json");
      const tokenData = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
      token = tokenData.token;
    });

    test("GET /bearer - Verify Bearer token authorization header", async ({
      request,
    }) => {
      const response = await request.get("https://httpbin.org/bearer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(true);
      expect(body.token).toBe(token);
    });

    test("DELETE /booking/:id - Perform authenticated mutation with token", async ({
      request,
    }) => {
      // 1. Create a transient record
      const createRes = await request.post(
        "https://restful-booker.herokuapp.com/booking",
        {
          data: {
            firstname: "Bearer",
            lastname: "AuthUser",
            totalprice: 120,
            depositpaid: true,
            bookingdates: { checkin: "2026-05-01", checkout: "2026-05-05" },
          },
        },
      );
      expect(createRes.status()).toBe(200);
      const { bookingid } = await createRes.json();

      // 2. Delete using token (Restful-booker accepts token via Cookie)
      const deleteRes = await request.delete(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
          headers: {
            Cookie: `token=${token}`,
          },
        },
      );

      expect(deleteRes.status()).toBe(201);
    });
  },
);
