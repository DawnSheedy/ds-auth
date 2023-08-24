import { getPermIdByName } from "./getPermIdByName";

describe("get perm id by name", () => {
  it("should get the permission id if it exists", async () => {
    expect(await getPermIdByName("PERM_ADMIN")).toBeTruthy();
  });

  it("should return undefined if permission does not exist", async () => {
    expect(await getPermIdByName("FAKE_PERM")).toBeUndefined();
  });
});
