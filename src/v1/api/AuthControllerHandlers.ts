import {
  clearAuthCookies,
  issueCookiesForToken,
} from "@dawnsheedy/ds-auth-lib";
import { compare } from "bcrypt";
import { RequestHandler } from "express";
import { getUserByEmail } from "../../dbUtils/getUserByEmail";
import { createUser } from "../../dbUtils/createUser";
import { getConfigValue } from "../../dbUtils/getConfigValue";

/**
 * Handler for authentication login.
 * 400s if password or email are excluded.
 * 403s if password is wrong or user doesn't exist
 * 200s and sets cookie if all is well
 * @param req
 * @param res
 * @returns
 */

export const authenticateHandler: RequestHandler = async (req, res) => {
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

  const token = issueCookiesForToken(
    {
      userId: user.id,
      userName: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: user.permissions.map((perm) => perm.name),
    },
    res
  );

  res.json({ access_token: token, expiresIn: process.env.TOKEN_LENGTH });
};
/**
 * Handler for token refresh
 * @param req
 * @param res
 */

export const tokenRefreshHandler: RequestHandler = (req, res) => {
  const token = issueCookiesForToken(req.identity!, res);

  res.json({ access_token: token, expiresIn: process.env.TOKEN_LENGTH });
};
/**
 * Handler for identification endpoint
 * @param req
 * @param res
 */

export const identificationHandler: RequestHandler = (req, res) => {
  res.json({
    userId: req.user?.id,
    userName: req.user?.email,
    firstName: req.user?.firstName,
    lastName: req.user?.lastName,
    permissions: req.user?.permissions.map((perm) => perm.name),
  });
};
/**
 * Request handler for user logout
 * @param _req
 * @param res
 */

export const logoutHandler: RequestHandler = (_req, res) => {
  clearAuthCookies(res);
  res.sendStatus(200);
};
/**
 * Handler for user creation
 * @param req
 * @param res
 * @returns
 */

export const creationHandler: RequestHandler = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.sendStatus(400);
  }

  const allowSignups = (await getConfigValue("allowSignup")) === "true";

  if (!allowSignups) {
    return res.sendStatus(403);
  }

  const email = req.body.email.toLowerCase();

  const user = await getUserByEmail(email);

  if (user) {
    return res.sendStatus(403);
  }

  await createUser(
    req.body.firstName,
    req.body.lastName,
    email,
    req.body.password
  );

  res.sendStatus(200);
};
