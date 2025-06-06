import { Faker, en } from '@faker-js/faker'; // Corrected import for modular faker
import fs from 'fs';
import path from 'path';
import { Company } from '../interfaces/Company'; // Adjust path if your structure differs

// Initialize Faker instance
const faker = new Faker({ locale: [en] });

const generateMockCompanies = (count: number): Company[] => {
  const companies: Company[] = [];
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
const outputDir = path.join(__dirname, '..', 'database');

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const filePath = path.join(outputDir, 'companies.json');

fs.writeFileSync(filePath, JSON.stringify(companiesData, null, 2));
console.log(`Successfully generated ${companiesData.length} companies to ${filePath}`);
