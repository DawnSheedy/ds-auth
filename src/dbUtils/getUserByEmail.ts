import { IPermission } from "../schema/Permission";
import { User } from "../schema/User";

/**
 * Given an email, return the user if exists, null if not
 * @param email
 * @returns
 */
export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email })
    .populate<{
      permissions: IPermission[];
    }>("permissions")
    .exec();
  return user;
};
