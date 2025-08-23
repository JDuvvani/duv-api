import { IUserRepo } from "@/modules/user/user.repo";
import { UserService } from "@/modules/user/user.service";
import { CreateUserData, IUserLogin } from "@/modules/user/user.validators";
import { IAuthResponse } from "@/modules/auth/auth.validators";
import { JwtPayload, JwtUtils } from "@/utils/jwt.utils";
import { parseExpiry } from "@/utils/parseExpiry";
import env from "@/config/env";
import { IUser } from "@/modules/user/user.model";

export class AuthService {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly userService: UserService
  ) {}

  signup = async (userData: CreateUserData): Promise<IAuthResponse> => {
    const user = await this.userService.signup(userData);
    const payload: JwtPayload = {
      jti: crypto.randomUUID(),
      id: user.toJSON().id,
      username: user.username,
    };

    const { accessToken, refreshToken } = JwtUtils.generateTokenPair(payload);
    const expiresAt = new Date(
      Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRES)
    );

    user.addRefreshToken({
      jti: payload.jti!,
      expiresAt,
      token: refreshToken,
      createdAt: new Date(),
    });
    await user.save();

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  };

  login = async (loginData: IUserLogin): Promise<IAuthResponse> => {
    const { username, password } = loginData;

    const user = await this.userRepo.findByUsername(username);
    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await user.correctPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const payload: JwtPayload = {
      jti: crypto.randomUUID(),
      id: user.toJSON().id,
      username: user.username,
    };

    const { accessToken, refreshToken } = JwtUtils.generateTokenPair(payload);
    const expiresAt = new Date(
      Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRES)
    );

    user.addRefreshToken({
      jti: payload.jti!,
      token: refreshToken,
      expiresAt,
      createdAt: new Date(),
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  };

  refreshToken = async (refreshTokenRaw: string): Promise<string> => {
    const payload: JwtPayload = JwtUtils.verifyRefreshToken(refreshTokenRaw);

    const user = await this.userRepo.findById(payload.id);
    if (!user) throw new Error("User not found");

    const stored = user.refreshTokens.find((rt) => rt.jti === payload.jti);
    if (!stored) throw new Error("Refresh token not recognized");

    if (stored.expiresAt < new Date()) throw new Error("Refresh token expired");

    const valid = refreshTokenRaw === stored.token;
    if (!valid) throw new Error("Invalid refresh token");

    const accessToken = JwtUtils.generateAccessToken({
      id: user.id,
      username: user.username,
    });

    return accessToken;
  };

  logout = async (refreshTokenRaw: string) => {
    const payload: JwtPayload = JwtUtils.verifyRefreshToken(refreshTokenRaw);
    const user = await this.userRepo.findById(payload.id);
    if (!user) return;
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.jti !== payload.jti
    );
    await user.save();
  };

  getCurrentUser = async (id: string): Promise<IUser | null> => {
    return await this.userRepo.findById(id);
  };
}
