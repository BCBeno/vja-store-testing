import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

export const testUsers = {
  defaultUser: { email: process.env.EMAIL_ACCOUNT || '', password: process.env.EMAIL_PASSWORD || '' },
  randomUser: { email: faker.internet.email(), password: faker.internet.password() },
};