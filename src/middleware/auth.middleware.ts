import { UserRepo } from "@/modules/user/user.repo";
import { JwtPayload, JwtUtils } from "@/utils/jwt.utils";
import { Fail } from "@/utils/responseFormat";
import { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export class AuthMiddleware {
  constructor(private userRepo: UserRepo) {}

  authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"]?.trim();
    if (!authHeader?.startsWith("Bearer ") || authHeader.length <= 7)
      return res
        .status(401)
        .json(Fail("Missing or invalid authorization header"));

    const token = authHeader.substring(7);
    try {
      const decoded: JwtPayload = JwtUtils.verifyAccessToken(token);

      const user = await this.userRepo.findById(decoded.id);
      if (!user) return res.status(401).json(Fail("User no longer exists"));

      req.user = {
        id: decoded.id,
        username: decoded.username,
      };
      next();
    } catch (err) {
      return res.status(401).json(Fail("Invalid or expired access token"));
    }
  };

  validateRefreshToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json(Fail("Missing refresh token"));

    const decoded = JwtUtils.verifyRefreshToken(refreshToken);
    const user = await this.userRepo.findById(decoded.id);

    if (!user) return res.status(401).json(Fail("Invalid refresh token"));

    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
    next();
  };
}
