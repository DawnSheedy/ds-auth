import { AuthToken } from "@dawnsheedy/ds-auth-lib";

export {};

declare global {
  namespace Express {
    export interface Request {
      identity?: AuthToken;
    }
  }
}
