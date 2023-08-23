import {
  getJWTFromToken,
  userAuthenticatedMiddleware,
} from "@dawnsheedy/ds-auth-lib";
import { Controller } from "../../types/Controller";
import { compare } from "bcrypt";
import { RequestHandler } from "express";
import { getUserByEmail } from "../../dbUtils/getUserByEmail";

/**
 * Handler for authentication login.
 * 400s if password or email are excluded.
 * 403s if password is wrong or user doesn't exist
 * 200s and sets cookie if all is well
 * @param req
 * @param res
 * @returns
 */
const authenticateHandler: RequestHandler = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }
  const user = await getUserByEmail(req.body.email.toLowerCase());

  if (!user) {
    return res.sendStatus(403);
  }

  const passwordIsValid = await compare(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.sendStatus(403);
  }

  const token = getJWTFromToken({
    userId: user.id,
    userName: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions: user.permissions.map((perm) => perm.name),
  });

  res.cookie("authToken", token);

  res.json({ access_token: token, expiresIn: process.env.TOKEN_LENGTH });
};

/**
 * Handler for token refresh
 * @param req
 * @param res
 */
const tokenRefreshHandler: RequestHandler = (req, res) => {
  const token = getJWTFromToken(req.identity!);
  res.cookie("authToken", token);

  res.json({ access_token: token, expiresIn: process.env.TOKEN_LENGTH });
};

/**
 * Handler for identification endpoint
 * @param req
 * @param res
 */
const identificationHandler: RequestHandler = (req, res) => {
  res.json(req.identity);
};

/**
 * Request handler for user logout
 * @param _req
 * @param res
 */
const logoutHandler: RequestHandler = (_req, res) => {
  res.clearCookie("authToken");
  res.sendStatus(200);
};

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
  ],
};
