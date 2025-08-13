import "module-alias/register";

import { Server } from "http";
import logger from "@/utils/logger";
import env from "@/config/env";
import app from "@/app";

let server: Server;

const startServer = async () => {
  try {
    server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error(err, "Startup error:");
    await shutdown(1);
  }
};

const shutdown = async (exitCode: number) => {
  try {
    logger.info("Shutting down server...");
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      logger.info("Server closed");
    }
  } catch (err) {
    logger.error(err, "Error during shutdown:");
  } finally {
    process.exit(exitCode);
  }
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("uncaughtException", async (err) => {
  logger.error(err, "Uncaught exception:");
  await shutdown(1);
});
process.on("unhandledRejection", async (reason) => {
  logger.error(reason, "Unhandled rejection:");
  await shutdown(1);
});

startServer();
