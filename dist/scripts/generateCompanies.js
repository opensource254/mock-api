"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker"); // Corrected import for modular faker
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Initialize Faker instance
const faker = new faker_1.Faker({ locale: [faker_1.en] });
const generateMockCompanies = (count) => {
    const companies = [];
    for (let i = 0; i < count; i++) {
        companies.push({
            id: faker.string.uuid(),
            name: faker.company.name(),
            slogan: faker.company.catchPhrase(),
            // For industry, bsNoun() can be a bit too generic.
            // Using a combination or a more specific set if available might be better.
            // For now, bs() gives a phrase which might be more interesting than just a noun.
            industry: faker.company.bs(),
            address: faker.location.streetAddress({ useFullAddress: true }), // Get full address
        });
    }
    return companies;
};
const companiesData = generateMockCompanies(15); // Generate 15 companies
const outputDir = path_1.default.join(__dirname, '..', 'database');
// Ensure the directory exists
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir, { recursive: true });
}
const filePath = path_1.default.join(outputDir, 'companies.json');
fs_1.default.writeFileSync(filePath, JSON.stringify(companiesData, null, 2));
console.log(`Successfully generated ${companiesData.length} companies to ${filePath}`);
