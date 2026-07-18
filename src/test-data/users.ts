import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

if(!process.env.EMAIL_ACCOUNT || !process.env.EMAIL_PASSWORD) {
  throw new Error('Missing required environment variables: EMAIL_ACCOUNT and EMAIL_PASSWORD. Please set them in your .env file.');
}

export const testUsers = {
  defaultUser: { email: process.env.EMAIL_ACCOUNT || '', password: process.env.EMAIL_PASSWORD || '' },
  randomUser: { email: faker.internet.email(), password: faker.internet.password() },
};