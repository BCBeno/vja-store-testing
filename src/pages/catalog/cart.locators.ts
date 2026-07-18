import { Page, Locator } from '@playwright/test';

export const cartLocators = (page: Page) => ({
    checkoutButton: (): Locator => page.getByTestId('checkout-btn'),
    emptyCartMessage: (): Locator => page.getByText('Your cart is empty.'),
    removeCartItemButton: (): Locator => page.getByTestId('remove-cart-item-btn'),
    priceAndQuantityText: (): Locator => page.getByText('· Qty'),
    subtotalText: (): Locator => page.getByText('Subtotal$'),
    orderPlacedSuccessMessage: (): Locator => page.getByTestId('order-success-message'),
    cartIsEmpty: (): Locator => page.getByText('Your cart is empty.'),
});