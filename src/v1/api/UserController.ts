import { userAuthenticatedMiddleware } from "@dawnsheedy/ds-auth-lib";
import { Controller } from "../../types/Controller";
import { RequestHandler } from "express";
import { getUserByEmail } from "../../dbUtils/getUserByEmail";
import { User } from "../../schema/User";
import { hash } from "bcrypt";

const creationHandler: RequestHandler = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.sendStatus(400);
  }

  const user = await getUserByEmail(req.body.email.toLowerCase());

  if (user) {
    return res.sendStatus(403);
  }

  const password = await hash(req.body.password, 10);

  await User.create({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email.toLowerCase(),
    password,
    permissions: [],
  });

  res.sendStatus(200);
};

export const UserController: Controller = {
  name: "User Controller 🙋🏻",
  endpoints: [
    {
      name: "User Creation",
      path: "/",
      method: "POST",
      middleware: [userAuthenticatedMiddleware],
      handler: creationHandler,
    },
  ],
};
