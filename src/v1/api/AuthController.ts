import {
  getJWTFromToken,
  userAuthenticatedMiddleware,
} from "@dawnsheedy/ds-auth-lib";
import { Controller } from "../../types/Controller";
import { User } from "../../schema/User";
import { compare } from "bcrypt";
import { IPermission } from "../../schema/Permission";

export const AuthController: Controller = {
  name: "Authentication Controller 🔐",
  endpoints: [
    {
      name: "User Authentication",
      path: "/authenticate",
      method: "POST",
      /**
       * Handler for authentication login.
       * 400s if password or email are excluded.
       * 403s if password is wrong or user doesn't exist
       * 200s and sets cookie if all is well
       * @param req
       * @param res
       * @returns
       */
      handler: async (req, res) => {
        if (!req.body.email || !req.body.password) {
          return res.sendStatus(400);
        }
        const user = await User.findOne({ email: req.body.email }).populate<{
          permissions: IPermission[];
        }>("Permission");

        if (!user) {
          return res.sendStatus(403);
        }

        const passwordIsValid = await compare(req.body.password, user.password);

        if (!passwordIsValid) {
          return res.sendStatus(403);
        }

        const token = getJWTFromToken({
          userId: user.id,
          userName: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          permissions: user.permissions.map((perm) => perm.name),
        });

        res.cookie("authToken", token);

        res.json({ accessToken: token });
      },
    },
    {
      name: "User Identitifier",
      path: "/identity",
      method: "GET",
      handler: (req, res) => {
        res.json(req.identity);
      },
    },
    {
      name: "User Logout",
      path: "/logout",
      method: "POST",
      middleware: [userAuthenticatedMiddleware],
      handler: (_req, res) => {
        res.clearCookie("authToken");
        res.sendStatus(200);
      },
    },
  ],
};
