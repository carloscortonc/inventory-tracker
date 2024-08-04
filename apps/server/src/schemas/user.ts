import { User as UserEntity } from "@/entities/user";
import mongoose from "mongoose";

const schema = new mongoose.Schema<UserEntity>({
  username: { type: "string", unique: true },
  password: { type: "string", required: true },
  isServiceAccount: { type: "boolean", default: false },
});

const User = mongoose.model("users", schema);

export default User;
