import "module-alias/register";

import { Server } from "http";
import logger from "@/utils/logger";
import env from "@/config/env";
import app from "@/app";
import { connectDB, disconnectDB } from "@/config/db";

let server: Server;

const startServer = async () => {
  try {
    await connectDB();

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

    await disconnectDB();
    process.exit(exitCode);
  } catch (err) {
    logger.error(err, "Error during shutdown:");
    process.exit(1);
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
