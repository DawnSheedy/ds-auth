import { AppConfigEntry } from "../schema/AppConfigEntry";

/**
 * Get a given config value from db
 * @param key
 */
export const getConfigValue = async (key: string) => {
  const entry = await AppConfigEntry.findOne({ key }).exec();
  return entry?.value ?? "";
};
