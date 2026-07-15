import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Login', async () => {
      await page.goto('/login');
      await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
      await page.getByTestId('login-password-input').fill(process.env.EMAIL_PASSWORD || '');
      await page.getByTestId('login-btn').click();
    });
    
    await test.step('Clear cart', async () => {
      await page.goto('/cart');
      let cartItemsCount = await page.getByTestId('remove-cart-item-btn').count();
      while (cartItemsCount > 0) {
        await page.getByTestId('remove-cart-item-btn').first().click();
        cartItemsCount--;
      }
    });
    
    await test.step('Navigate to products', async () => {
      await page.goto('/products');
    });
  });

  test('[C56] Add to Cart Price Summary Calculation', async ({ page }) => {
    //Arrange
    await expect(page.getByTestId('cart-link')).toBeVisible();
    await expect(page.getByTestId('product-card').first()).toBeVisible();
    await expect(page.getByTestId('add-to-cart-btn').first()).toBeVisible();

    await expect(page.getByTestId('product-card').nth(1)).toBeVisible();
    await expect(page.getByTestId('add-to-cart-btn').nth(1)).toBeVisible();

    await expect(page.getByTestId('product-card').nth(2)).toBeVisible();
    await expect(page.getByTestId('add-to-cart-btn').nth(2)).toBeVisible();

    //Act
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('add-to-cart-btn').nth(1).click();
    await page.getByTestId('add-to-cart-btn').nth(1).click();
    await page.getByTestId('add-to-cart-btn').nth(2).click();
    await page.goto('/cart');
    const lineTexts = await page.getByText('· Qty').allTextContents();

    const expectedSubtotal = lineTexts.reduce((sum, text) => {
        const [priceStr, qtyStr] = text.split('·');
        const price = parseFloat(priceStr.replace('$', '').trim());
        const qty = parseInt(qtyStr.replace('Qty', '').trim(), 10);
        return sum + price * qty;
    }, 0);

    const subtotalText = await page.getByText('Subtotal$').textContent();
    const subtotal = parseFloat((subtotalText || '').replace('Subtotal$', ''));

    //Assert
    expect(subtotal).toEqual(expectedSubtotal);
    
  });

  test('[C57] Checkout With a Non-Empty Cart', async ({ page }) => {
    await test.step('Add item to cart and proceed to checkout', async () => {
      await page.getByTestId('product-card').first().click();
      await page.getByTestId('add-to-cart-btn').first().click();
      await page.getByTestId('cart-link').click();
      await page.getByTestId('checkout-btn').click();
    });

    await test.step('Verify order was placed', async () => {
      await expect(page.getByTestId('order-success-message')).toBeVisible();
    });
  });



  test.afterEach(async ({ page }) => {
    await test.step('Clear cart', async () => {
      await page.goto('/cart');
      let cartItemsCount = await page.getByTestId('remove-cart-item-btn').count();
      while (cartItemsCount > 0) {
        await page.getByTestId('remove-cart-item-btn').first().click();
        cartItemsCount--;
      }
    });
    
    await test.step('Logout', async () => {
      await expect(page.getByTestId('logout-btn')).toBeVisible();
      await page.getByTestId('logout-btn').click();
    });
  });
  
});