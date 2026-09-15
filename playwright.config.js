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
    // --- 1. Specialized Auth Projects (Part 3) ---
    {
      name: "setup",
      testMatch: /.*auth\.setup\.js/,
    },
    {
      name: "bearer-tests",
      dependencies: ["setup"],
      testMatch: /.*bearer\.spec\.js/,
    },
    {
      name: "basic-auth",
      testMatch: /.*basic-auth\.spec\.js/,
      use: {
        httpCredentials: {
          username: "admin",
          password: "password123",
        },
      },
    },
    {
      name: "api-key",
      testMatch: /.*api-key\.spec\.js/,
      use: {
        extraHTTPHeaders: {
          "x-api-key": "live_secret_key_999",
        },
      },
    },

    // --- 2. Catch-All / Standard API Project (Part 4, 5, 6, & other tests) ---
    {
      name: "general-api",
      testMatch: /.*\.spec\.js/,
      // Ignore the custom auth specs so they don't run twice
      testIgnore: [
        /.*basic-auth\.spec\.js/,
        /.*api-key\.spec\.js/,
        /.*bearer\.spec\.js/,
      ],
    },
  ],
});
