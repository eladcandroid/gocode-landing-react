import { test, expect } from "@playwright/test";

test.describe("Leads Form", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page
    await page.goto("/");
  });

  test("should display the contact form", async ({ page }) => {
    // Scroll to the contact section
    await page.locator("text=Contact Us").first().scrollIntoViewIfNeeded();

    // Check if the form elements are visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should submit a lead successfully", async ({ page }) => {
    // Generate unique test data
    const testEmail = `test-${Date.now()}@example.com`;
    const testMessage = `Test message from Playwright at ${new Date().toISOString()}`;

    // Scroll to the contact section
    await page.locator("text=Contact Us").first().scrollIntoViewIfNeeded();

    // Fill out the form
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator("textarea").fill(testMessage);

    // Listen for console logs to verify the lead creation
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      consoleMessages.push(msg.text());
    });

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Wait for the form submission to complete
    await page.waitForTimeout(3000);

    // Check for success indicators
    // The form should be cleared after successful submission
    await expect(page.locator('input[type="email"]')).toHaveValue("");
    await expect(page.locator("textarea")).toHaveValue("");

    // Check console logs for successful lead creation
    const hasLeadCreationLog = consoleMessages.some(
      (msg) =>
        msg.includes("Sending to Make.com") ||
        msg.includes("Lead ID") ||
        msg.includes("webhook notification sent")
    );

    console.log("Console messages:", consoleMessages);
    expect(hasLeadCreationLog).toBeTruthy();
  });

  test("should validate required fields", async ({ page }) => {
    // Scroll to the contact section
    await page.locator("text=Contact Us").first().scrollIntoViewIfNeeded();

    // Try to submit without filling the form
    await page.locator('button[type="submit"]').click();

    // Check that the form validation prevents submission
    // The email field should show validation error
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute("required");

    const textareaInput = page.locator("textarea");
    await expect(textareaInput).toHaveAttribute("required");
  });

  test("should validate email format", async ({ page }) => {
    // Scroll to the contact section
    await page.locator("text=Contact Us").first().scrollIntoViewIfNeeded();

    // Fill with invalid email
    await page.locator('input[type="email"]').fill("invalid-email");
    await page.locator("textarea").fill("Test message");

    // Try to submit
    await page.locator('button[type="submit"]').click();

    // The browser should prevent submission due to invalid email format
    const emailInput = page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });

  test("should show loading state during submission", async ({ page }) => {
    // Scroll to the contact section
    await page.locator("text=Contact Us").first().scrollIntoViewIfNeeded();

    // Fill out the form
    await page.locator('input[type="email"]').fill("test@example.com");
    await page.locator("textarea").fill("Test message");

    // Submit the form and check for loading state
    await page.locator('button[type="submit"]').click();

    // The button should show loading state (disabled or with loading text/icon)
    const submitButton = page.locator('button[type="submit"]');

    // Wait a moment to see the loading state
    await page.waitForTimeout(500);

    // Check if button is disabled during submission
    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });
});

test.describe("Appwrite Integration", () => {
  test("should connect to Appwrite successfully", async ({ page }) => {
    // Navigate to the page
    await page.goto("/");

    // Check if there are any Appwrite connection errors in console
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for the page to load completely
    await page.waitForLoadState("networkidle");

    // Check for Appwrite-related errors
    const hasAppwriteErrors = consoleErrors.some(
      (error) =>
        error.toLowerCase().includes("appwrite") ||
        error.toLowerCase().includes("database") ||
        error.toLowerCase().includes("collection")
    );

    if (hasAppwriteErrors) {
      console.log("Appwrite errors found:", consoleErrors);
    }

    expect(hasAppwriteErrors).toBeFalsy();
  });
});
