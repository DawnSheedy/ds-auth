import { Schema, model } from "mongoose";

export interface IAppConfigEntry {
  key: string;
  value: string;
}

const appConfigEntrySchema = new Schema<IAppConfigEntry>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

const AppConfigEntry = model<IAppConfigEntry>(
  "AppConfigEntry",
  appConfigEntrySchema
);

export { AppConfigEntry };
