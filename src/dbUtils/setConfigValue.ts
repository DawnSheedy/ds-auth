import { AppConfigEntry } from "../schema/AppConfigEntry";

/**
 * Set a given key/value to the db
 * @param key
 * @param value
 */
export const setConfigValue = async (key: string, value: string) => {
  let entry = await AppConfigEntry.findOneAndUpdate({ key }, { value }).exec();
  if (!entry) {
    entry = await AppConfigEntry.create({ key, value });
  }
  return entry.value;
};
