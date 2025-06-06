export interface User {
  id: number;
  picture?: string; // Optional as it's missing in one entry
  age: number;
  name: string;
  gender: string;
  company: string;
  email: string;
  // username is not in the JSON, so I will omit it from the interface
}
