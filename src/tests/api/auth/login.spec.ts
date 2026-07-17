import { test, expect } from '@playwright/test'
import { testUsers } from '../../../test-data/users';

test.describe('Login with api', () => {
    const defaultUser = testUsers.defaultUser;
    const randomUser = testUsers.randomUser;

    test('Login With Valid Credentials', async ({ request }) => {
        const response = await request.post('/api/auth/login', {
            data: {
                email: defaultUser.email,
                password: defaultUser.password
            }
        });

        const responseBody = await response.json();

        expect(responseBody.user).toBeDefined();
        expect(response).toBeOK();
        expect(responseBody.user.email).toBe(defaultUser.email);
        expect(responseBody.user.name).toBeDefined();
        expect(responseBody.user.id).toBeDefined();
    });

    test('Login With Invalid Password', async ({ request }) => {
        const response = await request.post('/api/auth/login', {
            data: {
                email: defaultUser.email,
                password: 'invalidpassword'
            }
        });

        const responseBody = await response.json();

        expect(responseBody.error).toBe('Invalid email or password');
        expect(response.status()).toBe(401);
    });

    test('Login with random user', async ({ request }) => {
        const response = await request.post('api/auth/login', {
            data: {
                email: randomUser.email,
                password: randomUser.password
            }
        });
        const responseBody = await response.json();

        expect(responseBody.error).toBe('Invalid email or password');
        expect(response.status()).toBe(401);
    });
        
});