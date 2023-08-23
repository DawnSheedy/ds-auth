import { userAuthenticatedMiddleware } from "@dawnsheedy/ds-auth-lib";
import { Controller } from "../../types/Controller";
import { RequestHandler } from "express";
import { getUserByEmail } from "../../dbUtils/getUserByEmail";
import { User } from "../../schema/User";
import { hash } from "bcrypt";
import { userIdParamMiddleware } from "../middleware/userIdParamMiddleware";

export const UserController: Controller = {
  name: "User Controller 🙋🏻",
  paramHandlers: [{ param: "userId", handler: userIdParamMiddleware }],
  endpoints: [],
};
