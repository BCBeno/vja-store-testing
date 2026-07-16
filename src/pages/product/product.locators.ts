import { Page, Locator } from '@playwright/test';

export const productLocators = (page: Page) => ({
    addToCartButton: (): Locator => page.getByTestId('add-to-cart-btn'),
    productCard: (): Locator => page.getByTestId('product-card'),
    productFavoriteButton: (): Locator => page.getByTestId('favorite-btn'),
    productPrice: (productNumber: number): Locator => page.getByTestId('product-card').nth(productNumber).getByText('$').first(),
    sortSelect: (): Locator => page.getByTestId('sort-select'),
    filterCheckbox: (brand: string): Locator => page.getByRole('checkbox', { name: brand }),
    clearFiltersButton: (): Locator => page.getByTestId('clear-filters-btn'),
  });