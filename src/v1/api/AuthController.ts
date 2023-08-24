import {
  userAuthenticatedMiddleware,
} from "@dawnsheedy/ds-auth-lib";
import { Controller } from "../../types/Controller";
import { authenticateHandler, tokenRefreshHandler, identificationHandler, logoutHandler, creationHandler } from "./AuthControllerHandlers";

/**
 * Controller for authentication endpoints
 */
export const AuthController: Controller = {
  name: "Authentication Controller 🔐",
  endpoints: [
    {
      name: "User Authentication",
      path: "/authenticate",
      method: "POST",
      handler: authenticateHandler,
    },
    {
      name: "Token Refresh",
      path: "/refresh",
      method: "POST",
      handler: tokenRefreshHandler,
    },
    {
      name: "User Identitifier",
      path: "/identity",
      method: "GET",
      middleware: [userAuthenticatedMiddleware],
      handler: identificationHandler,
    },
    {
      name: "User Logout",
      path: "/logout",
      method: "POST",
      middleware: [userAuthenticatedMiddleware],
      handler: logoutHandler,
    },
    {
      name: "User Registration",
      path: "/",
      method: "POST",
      handler: creationHandler,
    },
  ],
};
