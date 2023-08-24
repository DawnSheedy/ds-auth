import mongoose from "mongoose";
import "./init/db";
import { seedConfigValues } from "./init/config";

beforeAll((done) => {
  mongoose.connection.on("connected", async () => {
    await seedConfigValues();
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
