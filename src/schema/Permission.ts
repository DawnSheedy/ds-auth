import { model, Schema, Types } from "mongoose";

export interface IPermission {
  // Permission Name
  name: string;
  // Permission description
  description: string;
  // Child permissions (automatically granted if given)
  children: Types.ObjectId[];
}

const permissionSchema = new Schema<IPermission>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  children: [{ type: Types.ObjectId, ref: "Permission" }],
});

const Permission = model<IPermission>("Permission", permissionSchema);

export { Permission };
