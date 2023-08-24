import { RequestHandler } from "express";
import { AppConfigEntry } from "../../schema/AppConfigEntry";

export const appParamIdMiddleware: RequestHandler = async (req, res, next) => {
  const param = await AppConfigEntry.findOne({
    key: req.params.appParamId,
  }).exec();

  if (!param) {
    return res.sendStatus(404);
  }

  req.appParam = param;

  next();
};
