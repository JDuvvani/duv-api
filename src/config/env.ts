import { object, string, treeifyError } from "zod";
import { config } from "dotenv";
import logger from "../utils/logger";

config();

const envSchema = object({
  PORT: string().transform(Number),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error(treeifyError(parsed.error).properties, "Invalid ENV");
  process.exit(1);
}

export default parsed.data;
