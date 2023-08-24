import { hash } from "bcrypt";
import { User } from "../schema/User";
import { getConfigValue } from "./getConfigValue";
import { getPermIdByName } from "./getPermIdByName";
import { ObjectId } from "mongoose";

/**
 * Create a new user with information
 * @param firstName
 * @param lastName
 * @param email
 * @param password
 */
export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const hashedPassword = await hash(password, 10);

  const permsToAdd: ObjectId[] = [];

  if ((await getConfigValue("autoAdmin")) === "true") {
    const adminPerm = await getPermIdByName("PERM_ADMIN");
    if (adminPerm) {
      permsToAdd.push(adminPerm);
    }
  }

  return await User.create({
    lastName: lastName,
    firstName: firstName,
    email: email.toLowerCase(),
    password: hashedPassword,
    permissions: permsToAdd,
  });
};
