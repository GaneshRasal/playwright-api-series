import { defineConfig } from "@playwright/test";
import path from "path";
import fs from "fs";

export default defineConfig({
  testDir: "./tests",
  /* Timeout per test in milliseconds */
  timeout: 30000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Workers for parallel execution */
  workers: process.env.CI ? 1 : undefined,

  /* HTML Reporter */
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwrightReport", open: "never" }],
  ],

  use: {
    /* Base URL for all API requests */
    baseURL: "https://jsonplaceholder.typicode.com",

    /* Global HTTP Headers */
    extraHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8",
    },
  },
  projects: [
    {
      // 1. The Setup Project: Runs first
      name: "setup",
      testMatch: /.*\.setup\.js/,
    },
    // 2. Project for Basic Auth tests
    {
      name: "basic-auth-tests",
      testMatch: /.*basic-auth\.spec\.js/,
      use: {
        httpCredentials: {
          username: "admin",
          password: "password123",
        },
      },
    },

    // 3. Project for API Key tests
    {
      name: "api-key-tests",
      testMatch: /.*api-key\.spec\.js/,
      use: {
        extraHTTPHeaders: {
          "x-api-key": "live_secret_key_999",
        },
      },
    },

    // 4. Project for Bearer Token tests
    {
      name: "bearer-token-tests",
      testMatch: /.*bearer\.spec\.js/,
      dependencies: ["setup"],
    },
  ],
});
