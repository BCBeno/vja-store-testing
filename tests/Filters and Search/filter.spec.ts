import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

test.describe('Filtering flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
        await page.getByTestId('login-password-input').fill(process.env.EMAIL_PASSWORD || '');
        await page.getByTestId('login-btn').click();
        await page.goto('/products');
    });

    test('[C61] Sort Options Work Correctly (Ascending)', async ({ page }) => {
        const firstPriceText = await page.getByText('$').first().textContent();
        const firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        //Act
        await page.getByTestId('sort-select').selectOption('price-asc');
        const newPriceText = await page.getByText('$').first().textContent();
        const newPrice = parseFloat((newPriceText || '').replace('$', ''));
        //Assert
        expect(newPrice).toBeLessThanOrEqual(firstPrice);
    });

    test('[C61] Sort Options Work Correctly (Descending)', async ({ page }) => {
        const firstPriceText = await page.getByText('$').first().textContent();
        const firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        //Act
        await page.getByTestId('sort-select').selectOption('price-desc');
        const newPriceText = await page.getByText('$').first().textContent();
        const newPrice = parseFloat((newPriceText || '').replace('$', ''));
        //Assert
        expect(newPrice).toBeGreaterThanOrEqual(firstPrice);
    });


    test('[C62] Clear Filters Resets All Filter States', async ({ page }) => {
        //Arrange
        const firstPriceText = await page.getByText('$').first().textContent();
        const firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        await page.getByRole('checkbox', { name: 'Adidas' }).click();
        await page.getByTestId('sort-select').selectOption('price-asc');
        const newPriceText = await page.getByText('$').first().textContent();
        const newPrice = parseFloat((newPriceText || '').replace('$', ''));
        await expect(newPrice).toBeLessThanOrEqual(firstPrice);
        await expect( page.getByRole('checkbox', { name: 'Adidas' })).toBeChecked();
        await expect(page.getByTestId('sort-select')).toHaveValue('price-asc');


        //Act
        await page.getByTestId('clear-filters-btn').click();
        //Assert
        await expect(page.getByTestId('sort-select')).toHaveValue('featured');
        await expect(page.getByRole('checkbox', { name: 'Adidas' })).not.toBeChecked();

        
    });

});