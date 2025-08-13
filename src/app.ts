import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

app.get("/api/healthcheck", (_req: Request, res: Response) => {
  res.json({
    message: "Server is up and running",
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "Resource not found",
  });
});

export default app;
