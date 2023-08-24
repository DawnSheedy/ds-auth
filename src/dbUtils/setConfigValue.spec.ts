import { getConfigValue } from "./getConfigValue";
import { setConfigValue } from "./setConfigValue";

describe("Set Config Value", () => {
  it("should update config value", async () => {
    await setConfigValue("appTitle", "ds-test");
    expect(await getConfigValue("appTitle")).toEqual("ds-test");
  });

  it("should create entry if not exists", async () => {
    await setConfigValue("appTestKey", "test");
    expect(await getConfigValue("appTestKey")).toEqual("test");
  });
});
