import mongoose from "mongoose";
import env from "@/config/env";
import logger from "@/utils/logger";
import { omit } from "lodash";

mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = { ...ret, id: ret._id };
    return omit(obj, ["_id"]);
  },
});

export const connectDB = async () => {
  await mongoose.connect(env.DB_URI);
  logger.info("Database connected");
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    logger.info("Database connection closed");
  }
};
