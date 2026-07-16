import { test as base} from '../fixtures/auth';
import { CartPage } from '../pages/catalog/cart.page';

type CartFixtures = {
    emptyCart: void;
};

export const test = base.extend<CartFixtures>({
    emptyCart: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await cartPage.goto();
        await cartPage.removeAllCartItems();
        await use();
    },
});

export { expect, Page } from '@playwright/test';