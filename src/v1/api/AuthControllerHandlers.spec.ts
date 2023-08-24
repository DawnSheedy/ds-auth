import { UserIdentity, getTokenFromJWT } from "@dawnsheedy/ds-auth-lib";
import { createUser } from "../../dbUtils/createUser";
import {
  authenticateHandler,
  creationHandler,
  identificationHandler,
  logoutHandler,
  tokenRefreshHandler,
} from "./AuthControllerHandlers";
import { getUserByEmail } from "../../dbUtils/getUserByEmail";
import { setConfigValue } from "../../dbUtils/setConfigValue";

describe("Auth Controller Handlers", () => {
  beforeAll(async () => {
    await createUser("test", "test", "test@example.org", "test");
  });

  describe("Login Endpoint", () => {
    it("should sign in and issue a cookie if credentials match", async () => {
      const sendStatus = jest.fn();
      const json = jest.fn();
      const cookie = jest.fn();
      const res = { sendStatus, json, cookie } as any;

      await authenticateHandler(
        { body: { email: "test@example.org", password: "test" } } as any,
        res,
        () => {}
      );

      expect(cookie).toHaveBeenCalled();
    });

    it("should 403 if no user found", async () => {
      const sendStatus = jest.fn();
      const json = jest.fn();
      const cookie = jest.fn();
      const res = { sendStatus, json, cookie } as any;

      await authenticateHandler(
        { body: { email: "testNotReal@example.org", password: "test" } } as any,
        res,
        () => {}
      );

      expect(sendStatus).toHaveBeenCalledWith(403);
    });

    it("should 403 if password incorrect", async () => {
      const sendStatus = jest.fn();
      const json = jest.fn();
      const cookie = jest.fn();
      const res = { sendStatus, json, cookie } as any;

      await authenticateHandler(
        { body: { email: "test@example.org", password: "testWrong" } } as any,
        res,
        () => {}
      );

      expect(sendStatus).toHaveBeenCalledWith(403);
    });

    it("should 400 if password empty", async () => {
      const sendStatus = jest.fn();
      const json = jest.fn();
      const cookie = jest.fn();
      const res = { sendStatus, json, cookie } as any;

      await authenticateHandler(
        { body: { email: "test@example.org" } } as any,
        res,
        () => {}
      );

      expect(sendStatus).toHaveBeenCalledWith(400);
    });

    it("should 400 if email empty", async () => {
      const sendStatus = jest.fn();
      const json = jest.fn();
      const cookie = jest.fn();
      const res = { sendStatus, json, cookie } as any;

      await authenticateHandler({ body: {} } as any, res, () => {});

      expect(sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("Identity endpoint", () => {
    it("should return user identity", async () => {
      const json = jest.fn();
      const user = await createUser("test", "test", "test", "test");

      identificationHandler({ user } as any, { json } as any, () => {});

      expect(json).toBeCalled();
      expect(json.mock.calls[0][0].firstName).toEqual(user.firstName);
    });
  });

  describe("Logout handler", () => {
    it("should clear auth cookie", () => {
      const clearCookie = jest.fn();
      const sendStatus = jest.fn();

      logoutHandler({} as any, { clearCookie, sendStatus } as any, () => {});

      expect(clearCookie).toBeCalledTimes(2);
      expect(sendStatus).toBeCalledWith(200);
    });
  });

  describe("Token Refresh Handler", () => {
    it("should issue new auth token", () => {
      const identity = { firstName: "test" } as UserIdentity;
      const cookie = jest.fn();
      const json = jest.fn();

      tokenRefreshHandler(
        { identity } as any,
        { cookie, json } as any,
        () => {}
      );

      expect(cookie).toHaveBeenCalled();
      expect(json).toHaveBeenCalled();

      const token = json.mock.calls[0][0].access_token;

      const savedIdentity = getTokenFromJWT(token);

      expect(savedIdentity?.firstName).toEqual("test");
    });
  });

  describe("User creation endpoint", () => {
    it("should create new user", async () => {
      const sendStatus = jest.fn();

      await creationHandler(
        {
          body: {
            email: "testhandler@example.com",
            password: "test",
            firstName: "test",
            lastName: "test",
          },
        } as any,
        { sendStatus } as any,
        () => {}
      );

      expect(sendStatus).toHaveBeenCalledWith(200);

      const user = await getUserByEmail("testhandler@example.com");

      expect(user?.firstName).toEqual("test");
    });

    it("should 403 if user already exists", async () => {
      const sendStatus = jest.fn();

      await createUser("test", "test", "testexists@example.com", "test");

      await creationHandler(
        {
          body: {
            email: "testexists@example.com",
            password: "test",
            firstName: "test",
            lastName: "test",
          },
        } as any,
        { sendStatus } as any,
        () => {}
      );

      expect(sendStatus).toHaveBeenCalledWith(403);
    });

    it("should 403 if signup is disabled", async () => {
      await setConfigValue("allowSignup", "false");

      const sendStatus = jest.fn();

      await creationHandler(
        {
          body: {
            email: "unique@example.com",
            password: "test",
            firstName: "test",
            lastName: "test",
          },
        } as any,
        { sendStatus } as any,
        () => {}
      );

      expect(sendStatus).toHaveBeenCalledWith(403);
      await setConfigValue("allowSignup", "true");
    });

    it("should 400 if request is missing data", async () => {
      const sendStatus = jest.fn();

      await creationHandler(
        {
          body: {
            email: "testexists@example.com",
            password: "test",
            lastName: "test",
          },
        } as any,
        { sendStatus } as any,
        () => {}
      );

      expect(sendStatus).toHaveBeenCalledWith(400);
    });
  });
});
