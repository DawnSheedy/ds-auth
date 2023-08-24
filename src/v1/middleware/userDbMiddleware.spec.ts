import { Document } from "mongoose";
import { IUser } from "../../schema/User";
import { createUser } from "../../dbUtils/createUser";
import { userDbMiddleware } from "./userDbMiddleware";

describe("DB User retrieval middleware", () => {
  let user: Document<unknown, {}, IUser>;

  beforeEach(async () => {
    user = await createUser("test", "test", "1@example.com", "test");
  });

  it("should return database user for given logged in user", async () => {
    const next = jest.fn();
    const req = { identity: { userId: user.id } } as any;

    await userDbMiddleware(req, {} as any, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toEqual(user.id);
  });

  it("should 401 if no identity provided", async () => {
    const sendStatus = jest.fn();

    await userDbMiddleware({} as any, { sendStatus } as any, () => {});

    expect(sendStatus).toHaveBeenCalledWith(401);
  });

  it("should 401 (and clear cookie) if user cannot be found", async () => {
    const sendStatus = jest.fn();
    const clearCookie = jest.fn();

    // Random objectId
    await userDbMiddleware(
      { identity: { userId: "507f191e810c19729de860ea" } } as any,
      { sendStatus, clearCookie } as any,
      () => {}
    );

    expect(sendStatus).toHaveBeenCalledWith(401);
    expect(clearCookie).toHaveBeenCalledTimes(2);
  });
});
