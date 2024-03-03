// express.d.ts
import { JwtPayload } from './jwt-payload.interface'; // Adjust the path based on your project structure

declare namespace Express {
  interface Request {
    user?: JwtPayload;
  }
}
