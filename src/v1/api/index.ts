import { Router } from "express";
import { Controller } from "../../types/Controller";
import { AuthController } from "./AuthController";
import { registerControllerEndpoints } from "../../util/registerControllerEndpoints";

const router = Router();

const v1Controller: Controller = {
  name: "v1 Api Controller",
  endpoints: [
    { name: "API Root Test", handler: (req, res) => res.sendStatus(200) },
    { name: "Auth Routes", path: "/auth", subController: AuthController },
  ],
};

registerControllerEndpoints(router, v1Controller);

export { router as v1Api };
