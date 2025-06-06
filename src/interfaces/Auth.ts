import { User } from './User'; // Adjust path if needed, seems correct

export interface JwtPayload {
  id: number; // Matches User.id type
  email: string;
  // Add any other user details you want in the token, but keep it minimal
}

declare global {
  namespace Express {
    export interface Request {
      user?: User; // Attaching the full User object after validation
    }
  }
}
