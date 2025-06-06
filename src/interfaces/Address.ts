export interface Address {
  id: string; // UUID
  street: string;
  city: string;
  zipCode: string;
  country: string;
  userId?: string; // Optional: if linking to a user
}
