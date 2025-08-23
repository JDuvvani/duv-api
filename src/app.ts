import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Fail, Success } from "@/utils/responseFormat";
import userRouter from "@/modules/user/user.route";
import cookieParser from "cookie-parser";
import authRouter from "@/modules/auth/auth.route";
import { errorHandler } from "@/middleware/errorHandler";

const app: Application = express();
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());

app.get("/api/healthcheck", (_req: Request, res: Response) => {
  res.json(
    Success<{ health: string }>("Server is up and running", {
      health: "Successful",
    })
  );
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json(Fail("Resource not found"));
});

app.use(errorHandler);

export default app;
