import { test } from "@playwright/test";
import { randomBytes } from "crypto";

// Force Playwright to run these tests in parallel even though they are in the same file
test.describe.configure({ mode: "parallel" });

test.describe("Parallel Execution Isolation Proof", () => {
  // Create 4 simulated payment tests
  for (let i = 1; i <= 4; i++) {
    test(`Simulate Payment Flow ${i}`, async ({}, testInfo) => {
      // 1. Generate a fake Transaction ID
      const txnId = `TXN-${randomBytes(3).toString("hex").toUpperCase()}`;
      const workerId = testInfo.workerIndex; // This gets the actual OS worker number!

      console.log(`🟢 [Worker ${workerId}] Auth generated: ${txnId}`);

      // 2. Simulate a 2-second network delay
      // (This forces the workers to run at the exact same time)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Downstream operation using the local variable
      console.log(`🔴 [Worker ${workerId}] Capture completed for: ${txnId}`);
    });
  }
});
