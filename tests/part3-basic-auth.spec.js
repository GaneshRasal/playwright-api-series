// tests/basic-auth.spec.js
import { test, expect } from "@playwright/test";

test.describe("Authentication: Basic Auth Suite", { tag: ["@token"] }, () => {
  test("GET /basic-auth - Authenticate using project httpCredentials", async ({
    request,
  }) => {
    // httpbin verifies basic auth credentials against the URL path parameters
    const response = await request.get(
      "https://httpbin.org/basic-auth/admin/password123",
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.authenticated).toBe(true);
    expect(body.user).toBe("admin");
  });
});
