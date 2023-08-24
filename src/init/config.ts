import { AppConfigEntry } from "../schema/AppConfigEntry";
import { IPermission, Permission } from "../schema/Permission";

const defaultConfigValues: [string, string][] = [
  ["allowSignup", "true"], // Allows new user signup.
  ["appTitle", "ds-auth"], // App title
];

const defaultPermissions: IPermission[] = [
  {
    name: "PERM_ADMIN",
    description: "Allows user to administrate permissions.",
    children: [],
  },
  {
    name: "USER_ADMIN",
    description: "Allows user to administrate users.",
    children: [],
  },
];

/**
 * Enter default config values into DB
 * @returns
 */
const seedConfigValues = async () => {
  console.log(`🌱 Seeding default values if not set.`);
  const configPromises = defaultConfigValues.map(async ([key, value]) => {
    const configEntry = await AppConfigEntry.findOne({ key }).exec();
    if (!configEntry) {
      console.log(`🌱 Seeding default config entry -> ${key}: ${value}`);
      await AppConfigEntry.create({ key, value });
    }
  });
  const permissionPromises = defaultPermissions.map(async (perm) => {
    const foundPerm = await Permission.findOne({ name: perm.name }).exec();
    if (!foundPerm) {
      console.log(`🌱 Seeding default permission -> ${perm.name}`);
      await Permission.create(perm);
    }
  });
  await Promise.all([...configPromises, ...permissionPromises]);
};

export { seedConfigValues };
