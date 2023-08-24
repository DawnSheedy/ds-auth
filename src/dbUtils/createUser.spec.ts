import { createUser } from "./createUser";
import { getUserByEmail } from "./getUserByEmail";

describe("Create User", () => {
  it("should automatically set user as admin if autoAdmin enabled", async () => {
    await createUser("test", "test", "admin@example.com", "test");
    const user = await getUserByEmail("admin@example.com");

    expect(user?.firstName).toEqual("test");
    expect(user?.permissions[0].name).toEqual("PERM_ADMIN");
  });

  it("should not automatically set user as admin if user is not admin user", async () => {
    await createUser("test2", "test", "test3@example.org", "test");
    const user = await getUserByEmail("test3@example.org");

    expect(user?.firstName).toEqual("test2");
    expect(user?.permissions.length).toEqual(0);
  });
});
