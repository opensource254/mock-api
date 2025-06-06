import { Faker, en } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { Address } from '../interfaces/Address'; // Adjust path if needed
import { User } from '../interfaces/User'; // To potentially link addresses to users
import usersData from '../database/users.json'; // To get existing user IDs

const faker = new Faker({ locale: [en] });
const existingUsers = usersData as User[];

const generateMockAddresses = (count: number): Address[] => {
  const addresses: Address[] = [];
  for (let i = 0; i < count; i++) {
    // Optionally link some addresses to existing users
    const randomUser = existingUsers[Math.floor(Math.random() * existingUsers.length)];
    const linkToUser = Math.random() > 0.5; // 50% chance to link to a user

    addresses.push({
      id: faker.string.uuid(),
      street: faker.location.streetAddress(), // This usually includes street name and number
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      userId: linkToUser && randomUser ? String(randomUser.id) : undefined, // Ensure userId is string if User.id is number
    });
  }
  return addresses;
};

const addressesData = generateMockAddresses(20); // Generate 20 addresses
const outputDir = path.join(__dirname, '..', 'database');

// Ensure the directory exists (it should, from companies generation)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const filePath = path.join(outputDir, 'addresses.json');

fs.writeFileSync(filePath, JSON.stringify(addressesData, null, 2));
console.log(`Successfully generated ${addressesData.length} addresses to ${filePath}`);
