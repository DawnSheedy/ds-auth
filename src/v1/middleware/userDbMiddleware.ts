import { RequestHandler } from "express";
import { User } from "../../schema/User";
import { IPermission } from "../../schema/Permission";

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
    res.clearCookie("authToken");
    return res.sendStatus(401);
  }

  req.user = user;

  next();
};
