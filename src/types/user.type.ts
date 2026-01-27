import { ObjectId } from "mongodb";

export enum Role {
  admin = "admin",
  moderator = "moderator",
  editor = "editor",
  viewer = "viewer",
}

export type User = {
  _id: ObjectId;
  name: string;
  email: string;
  role: Role;
}