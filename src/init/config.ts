import { AppConfigEntry } from "../schema/AppConfigEntry";

const defaultConfigValues: [string, string][] = [
  ["allowSignup", "true"], // Allows new user signup.
  ["autoAdmin", "true"], // Makes all new users admin. Once set to false, cannot ever be set back to true.
  ["appTitle", "ds-auth"], // App title
];

/**
 * Enter default config values into DB
 * @returns
 */
const seedConfigValues = async () => {
  if (!process.env.SEED) {
    return;
  }
  console.log(`🌱 Seeding default config values if not set.`);
  defaultConfigValues.forEach(async ([key, value]) => {
    const configEntry = await AppConfigEntry.findOne({ key }).exec();
    if (!configEntry) {
      console.log(`🌱 Seeding default config entry -> ${key}: ${value}`);
      await AppConfigEntry.create({ key, value });
    }
  });
};

seedConfigValues();
