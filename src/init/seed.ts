import { Permission } from "../schema/Permission";
import { User } from "../schema/User";

/**
 * Provide initial data for database
 * @returns 
 */
const seedData = async () => {
  if (!process.env.PERFORM_SEED) {
    return;
  }
  console.log("🌱 Seeding Initial Data");
  let permission = await Permission.findOne({ name: "ADMIN" }).exec();

  if (!permission) {
    console.log("🌱 Providing Seed Admin Permission");
    permission = await Permission.create({
      name: "ADMIN",
      description: "Allow access to permission management.",
    });
  }

  let user = await User.findOne({
    email: "dawn@dawnsheedy.com",
  }).exec();

  if (!user) {
    console.log("🌱 Providing Seed Admin User");
    await User.create({
      email: "dawn@dawnsheedy.com",
      firstName: "Dawn",
      lastName: "Sheedy",
      permissions: [permission._id],
    });
  }
};

seedData();
