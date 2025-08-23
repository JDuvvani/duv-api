import { object, string, treeifyError, url } from "zod";
import { config } from "dotenv";
import logger from "../utils/logger";

config();

const envSchema = object({
  NODE_ENV: string(),
  PORT: string().transform(Number),
  DB_URI: url(),
  JWT_ACCESS_EXPIRES: string().default("15m"),
  JWT_REFRESH_EXPIRES: string().default("7d"),
  JWT_PRIVATE_KEY_PATH: string(),
  JWT_PUBLIC_KEY_PATH: string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error(treeifyError(parsed.error).properties, "Invalid ENV");
  process.exit(1);
}

export default parsed.data;
