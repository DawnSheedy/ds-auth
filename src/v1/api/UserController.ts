import { Controller } from "../../types/Controller";
import { userIdParamMiddleware } from "../middleware/userIdParamMiddleware";

export const UserController: Controller = {
  name: "User Controller 🙋🏻",
  paramHandlers: [{ param: "userId", handler: userIdParamMiddleware }],
  endpoints: [],
};
