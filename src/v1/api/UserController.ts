import { userAuthenticatedMiddleware } from "@dawnsheedy/ds-auth-lib";
import { Controller } from "../../types/Controller";

export const UserController: Controller = {
  name: "Authentication Controller 🔐",
  endpoints: [
    {
      name: "Test",
      path: "/",
      method: "GET",
      middleware: [userAuthenticatedMiddleware],
      handler: (_req, res) => {
        res.sendStatus(200);
      },
    },
  ],
};
