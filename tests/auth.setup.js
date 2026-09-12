const { test: setup, expect } = require("@playwright/test");
import path from "path";
import fs from "fs";
const authDir = path.resolve(__dirname, "../.auth");
const tokenFile = path.join(authDir, "token.json");

setup("Authenticate and save dynamic token", async ({ request }) => {
  // Hit a real endpoint to generate a dynamic token

  const response = await request.post(
    "https://restful-booker.herokuapp.com/auth",
    {
      data: {
        username: "admin",
        password: "password123",
      },
    },
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  const token = body.token;
  expect(token).toBeTruthy();
  // Create .auth directory if it doesn't exist
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Save the raw token to a JSON file
  fs.writeFileSync(tokenFile, JSON.stringify({ token }, null, 2));
  console.log("✅ Token generated and saved globally:", token);
});
