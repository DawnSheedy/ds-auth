import { Schema, Types, model } from "mongoose";

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  permissions: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  permissions: [{ type: Types.ObjectId, ref: "Permission" }],
});

const User = model<IUser>("User", userSchema);

export { User };
