import { Permission } from "../schema/Permission";

/**
 * Given permission name, get ID
 * @param name
 */
export const getPermIdByName = async (name: string) => {
  const perm = await Permission.findOne({ name }).exec();
  if (!perm) {
    return undefined;
  }
  return perm.id;
};
