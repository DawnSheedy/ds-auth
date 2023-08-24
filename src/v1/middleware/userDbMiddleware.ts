import { RequestHandler } from "express";
import { User } from "../../schema/User";
import { IPermission } from "../../schema/Permission";
import { clearAuthCookies } from "@dawnsheedy/ds-auth-lib";

/**
 * Middleware to inject DB user into request context
 */
export const userDbMiddleware: RequestHandler = async (req, res, next) => {
  if (!req.identity) {
    return res.sendStatus(401);
  }

  const user = await User.findById(req.identity.userId).populate<{
    permissions: IPermission[];
  }>("permissions");

  if (!user) {
    clearAuthCookies(res);
    return res.sendStatus(401);
  }

  req.user = user;

  next();
};
