import { Router } from "express";
import { Controller } from "../../types/Controller";
import { AuthController } from "./AuthController";
import { registerControllerEndpoints } from "../../util/registerControllerEndpoints";
import { UserController } from "./UserController";
import { userAuthenticatedMiddleware } from "@dawnsheedy/ds-auth-lib";
import { AppParamsController } from "./AppParamsController";

const router = Router();

const v1Controller: Controller = {
  name: "v1 Api Controller",
  endpoints: [
    { name: "Auth Routes", path: "/auth", subController: AuthController },
    { name: "App Params", path: "/appinfo", subController: AppParamsController },
    {
      name: "User Routes",
      path: "/users",
      middleware: [userAuthenticatedMiddleware],
      subController: UserController,
    },
  ],
};

registerControllerEndpoints(router, v1Controller);

export { router as v1Api };
