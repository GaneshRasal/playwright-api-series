// tests/api-key.spec.js
const { test, expect } = require("@playwright/test");

test.describe("Authentication: API Key Suite", { tag: ["@token"] }, () => {
  test("GET /headers - Verify API key injected via project extraHTTPHeaders", async ({
    request,
  }) => {
    // httpbin echoes all received headers back in the response body
    const response = await request.get("https://httpbin.org/headers");

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.headers["X-Api-Key"]).toBe("live_secret_key_999");
  });
});
