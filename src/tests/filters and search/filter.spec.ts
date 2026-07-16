import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

test.describe('Filtering flow', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login and navigate to products', async () => {
            await page.goto('/login');
            await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
            await page.getByTestId('login-password-input').fill(process.env.EMAIL_PASSWORD || '');
            await page.getByTestId('login-btn').click();
            await page.goto('/products');
        });
    });

    test('[C61] Sort Options Work Correctly (Ascending)', async ({ page }) => {
        let firstPrice: number;
        
        await test.step('Get initial price', async () => {
            const firstPriceText = await page.getByText('$').first().textContent();
            firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        });
        
        await test.step('Select ascending sort option', async () => {
            await page.getByTestId('sort-select').selectOption('price-asc');
        });
        
        await test.step('Verify new price is less than or equal to first price', async () => {
            const newPriceText = await page.getByText('$').first().textContent();
            const newPrice = parseFloat((newPriceText || '').replace('$', ''));
            expect(newPrice).toBeLessThanOrEqual(firstPrice);
        });
    });

    test('[C61] Sort Options Work Correctly (Descending)', async ({ page }) => {
        let firstPrice: number;
        
        await test.step('Get initial price', async () => {
            const firstPriceText = await page.getByText('$').first().textContent();
            firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        });
        
        await test.step('Select descending sort option', async () => {
            await page.getByTestId('sort-select').selectOption('price-desc');
        });
        
        await test.step('Verify new price is greater than or equal to first price', async () => {
            const newPriceText = await page.getByText('$').first().textContent();
            const newPrice = parseFloat((newPriceText || '').replace('$', ''));
            expect(newPrice).toBeGreaterThanOrEqual(firstPrice);
        });
    });


    test('[C62] Clear Filters Resets All Filter States', async ({ page }) => {
        let firstPrice: number;
        
        await test.step('Get initial price', async () => {
            const firstPriceText = await page.getByText('$').first().textContent();
            firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        });

        await test.step('Apply filters and verify them', async () => {
            await page.getByRole('checkbox', { name: 'Adidas' }).click();
            await page.getByTestId('sort-select').selectOption('price-asc');
            const newPriceText = await page.getByText('$').first().textContent();
            const newPrice = parseFloat((newPriceText || '').replace('$', ''));
            await expect(newPrice).toBeLessThanOrEqual(firstPrice);
            await expect( page.getByRole('checkbox', { name: 'Adidas' })).toBeChecked();
            await expect(page.getByTestId('sort-select')).toHaveValue('price-asc');
        });

        await test.step('Clear the filters', async () => {
            await page.getByTestId('clear-filters-btn').click();
        });
        
        await test.step('Verify all filters are cleared', async () => {
            await expect(page.getByTestId('sort-select')).toHaveValue('featured');
            await expect(page.getByRole('checkbox', { name: 'Adidas' })).not.toBeChecked();
        });
    });

});