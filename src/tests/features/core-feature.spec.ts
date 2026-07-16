import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

test.describe('Core Feature Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
        await page.getByTestId('login-password-input').fill(process.env.EMAIL_PASSWORD || '');
        await page.getByTestId('login-btn').click();
        await page.goto('/products');
    });

    test('user can complete an order successfully', async ({ page }) => {

        //Act
        await page.getByTestId('product-card').first().click();
        await page.getByTestId('add-to-cart-btn').first().click();
        await page.getByTestId('cart-link').click();
        await page.getByTestId('checkout-btn').click();

        //Assert
        await expect(page.getByTestId('order-success-message')).toBeVisible();

    });

    test('user cannot checkout with an empty cart', async ({ page }) => {
        //Arrange
        await page.goto('/cart');
        let cartItemsCount = await page.getByText('· Qty').count();
        while (cartItemsCount > 0) {
            await page.getByTestId('remove-cart-item-btn').first().click();
            cartItemsCount--;
        }


        //Act
        await page.getByTestId('checkout-btn').click();

        //Assert
        await expect(page.getByTestId('cart-page').locator('div').filter({ hasText: 'Your cart is empty. Add items' })).toBeVisible();
    });


    test.afterEach(async ({ page }) => {
    await expect(page.getByTestId('logout-btn')).toBeVisible();
    await page.getByTestId('logout-btn').click();
  });
});