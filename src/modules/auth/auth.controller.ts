import { AuthService } from "@/modules/auth/auth.service";
import { CookieOptions, Request, Response } from "express";
import { IAuthResponse } from "@/modules/auth/auth.validators";
import env from "@/config/env";
import { Fail, Success } from "@/utils/responseFormat";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";

const COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {
  constructor(private authService: AuthService) {}

  signup = async (req: Request, res: Response) => {
    const result: IAuthResponse = await this.authService.signup(req.body);

    res.cookie(COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);
    res.status(201).json(
      Success("Token created", {
        user: result.user.toJSON(),
        accessToken: result.accessToken,
      })
    );
  };

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    res.cookie(COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);
    res.status(201).json(
      Success("Token created", {
        user: result.user.toJSON(),
        accessToken: result.accessToken,
      })
    );
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[COOKIE_NAME];
    const accessToken = await this.authService.refreshToken(refreshToken);

    res.status(200).json(Success("Access token created", { accessToken }));
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (!refreshToken)
      return res.status(401).json(Fail("Missing refresh token"));

    await this.authService.logout(refreshToken);
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    res.json(Success("Successfully logged out"));
  };

  getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const user = await this.authService.getCurrentUser(userId);

    res.json(Success("Current user retrieved", { user: user!.toJSON() }));
  };
}
