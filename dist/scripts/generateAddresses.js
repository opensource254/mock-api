"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const users_json_1 = __importDefault(require("../database/users.json")); // To get existing user IDs
const faker = new faker_1.Faker({ locale: [faker_1.en] });
const existingUsers = users_json_1.default;
const generateMockAddresses = (count) => {
    const addresses = [];
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
const outputDir = path_1.default.join(__dirname, '..', 'database');
// Ensure the directory exists (it should, from companies generation)
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir, { recursive: true });
}
const filePath = path_1.default.join(outputDir, 'addresses.json');
fs_1.default.writeFileSync(filePath, JSON.stringify(addressesData, null, 2));
console.log(`Successfully generated ${addressesData.length} addresses to ${filePath}`);
