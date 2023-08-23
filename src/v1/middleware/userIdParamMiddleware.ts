import { RequestHandler } from "express";

/**
 * Middleware gating access to user endpoints based on access permissions or self-ownership
 * @param req
 * @param res
 * @param next
 */
export const userIdParamMiddleware: RequestHandler = (req, res, next) => {
  const requestedUserId = req.params.userId;

  if (
    req.identity?.userId === requestedUserId ||
    req.identity?.permissions.includes("USER_ADMIN")
  ) {
    next();
  }

  res.sendStatus(404);
};
