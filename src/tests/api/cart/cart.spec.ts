import { test, expect } from '@playwright/test';
import { testUsers } from '../../../test-data/users';

test.describe('Checkout with products using api', () => {
    const defaultUser = testUsers.defaultUser;
    const authHeader = { Authorization: '' };

    test.beforeEach('Login with valid credentials', async ({ request }) => {
        const authHeader = { Authorization: '' };
        await test.step('Login with valid credentials', async () => {
            const loginResponse = await request.post('/api/auth/login', {
                data: {
                    email: defaultUser.email,
                    password: defaultUser.password,
                },
            });
            
            const loginResponseBody = await loginResponse.json();
            authHeader.Authorization = `Bearer ${loginResponseBody.token}`;
            expect(loginResponse.status()).toBe(200);

        });
    });


    test('Checkout with products', async ({ request }) => {
        
        
        await test.step('Add products to cart', async () => {
            const addToCartResponse1 = await request.post('/api/cart', {
                data: {
                    productId: 'p-elec-1',
                },
                headers: authHeader,
            });

            expect(addToCartResponse1.status()).toBe(200);

        });

        await test.step('Check the cart', async () => {
            const getCartResponse = await request.get('/api/cart', {
                headers: authHeader,
            });
            const cartResponseBody = await getCartResponse.json();
            expect(getCartResponse.status()).toBe(200);
            expect(cartResponseBody.items[0].product.id).toBe('p-elec-1');
        });

        await test.step('Checkout the cart', async () => {
            const checkoutResponse = await request.post('/api/orders', {
                headers: authHeader,
            });
            expect(checkoutResponse.status()).toBe(200);
        });
    });

    test('Checkout with empty cart', async ({ request }) => {
        await test.step('Ensure the cart is empty', async () => {
            const getCartResponse = await request.get('/api/cart', {
                headers: authHeader,
            });
            const cartResponseBody = await getCartResponse.json();
            expect(cartResponseBody.items.length).toBe(0);
        }
        );

        await test.step('Checkout the cart', async () => {
            const checkoutResponse = await request.post('/api/orders', {
                headers: authHeader,
            });
            expect(checkoutResponse.status()).toBe(400);
        });
    });

    test('checkout without login', async ({ request }) => {
        await test.step('Checkout the cart without login', async () => {
            const checkoutResponse = await request.post('/api/orders', {
                headers: {
                    Authorization: '',
                },
            });
            console.log('Checkout Response Status:', checkoutResponse);
            expect(checkoutResponse.status()).toBe(401);
        });
    });

});