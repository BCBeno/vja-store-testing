import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

export const testNewUsers = {
  randomUser: { name: faker.person.fullName(), email: faker.internet.email(), password: faker.internet.password() },
};