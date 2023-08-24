import { RequestHandler } from "express";
import { Controller } from "../../types/Controller";
import { AppConfigEntry } from "../../schema/AppConfigEntry";
import packageJson from "../../../package.json";
import { appParamIdMiddleware } from "../middleware/appParamIdMiddleware";
import { setConfigValue } from "../../dbUtils/setConfigValue";
import { userHasPermissionMiddleware } from "@dawnsheedy/ds-auth-lib";

/**
 * Retrieve list of all defined app params
 * @param _req
 * @param res
 */
export const appParamRetriever: RequestHandler = async (_req, res) => {
  const configs = await AppConfigEntry.find().exec();
  const config: Record<string, string> = {};
  configs.forEach((configEntry) => {
    config[configEntry.key] = configEntry.value;
  });
  config["appVersion"] = packageJson.version;
  config["environment"] = process.env.ENV ?? 'not-defined';
  res.json(config);
};

/**
 * Endpoint to patch new app config value
 * @param req
 * @param res
 * @returns
 */
export const appParamPatch: RequestHandler = async (req, res) => {
  if (!req.body.value) {
    return res.sendStatus(400);
  }
  await setConfigValue(req.appParam?.key!, req.body.value);
  res.json({ key: req.appParam?.key, value: req.body.value });
};

/**
 * Handler for posting new app config param
 * @param req
 * @param res
 * @returns
 */
export const appParamPost: RequestHandler = async (req, res) => {
  if (!req.body.key || req.body.value === undefined) {
    return res.sendStatus(400);
  }
  await setConfigValue(req.body.key, req.body.value);
  res.json({ key: req.body.key, value: req.body.value });
};

export const AppParamsController: Controller = {
  name: "App Parameter Controller 🛠️",
  paramHandlers: [{ param: "appParamId", handler: appParamIdMiddleware }],
  endpoints: [
    {
      name: "App Param List",
      path: "/",
      handler: appParamRetriever,
    },
    {
      name: "Patch App Param",
      path: "/:appParamId",
      method: "PATCH",
      middleware: [userHasPermissionMiddleware(["PERM_ADMIN"])],
      handler: appParamPatch,
    },
    {
      name: "Patch App Param",
      path: "/",
      method: "POST",
      middleware: [userHasPermissionMiddleware(["PERM_ADMIN"])],
      handler: appParamPost,
    },
  ],
};
