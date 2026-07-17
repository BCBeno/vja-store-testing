import { test, expect } from '@playwright/test';
import { testNewUsers } from '../../../test-data/newUsers';
import { testUsers } from '../../../test-data/users';

test.describe('Register with api', () => {
    const newUser = testNewUsers.randomUser;
    const defaultUser = testUsers.defaultUser;

    test('Register With Valid Credentials', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
            },
        });

        expect(response.status()).toBe(201);
    });

    test('Register With Existing User', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: newUser.name,
                email: defaultUser.email,
                password: defaultUser.password,
            },
        });

        const responseBody = await response.json();
        expect(response.status()).toBe(409);
        expect(responseBody.error).toBe('Email is already registered');
    });

    test('Register With Invalid Email', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: newUser.name,
                email: 'invalid-email',
                password: newUser.password,
            },
        });

        const responseBody = await response.json();
        expect(response.status()).toBe(400);
        expect(responseBody.error).toBe('Enter a valid email');
    });

    test('Register With Short Password', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: newUser.name,
                email: newUser.email,
                password: 'short',
            },
        });

        const responseBody = await response.json();
        expect(response.status()).toBe(400);
        expect(responseBody.error).toBe('Password must be at least 6 characters');
    });
});