import fs from "fs";
import path from "path";
import ms from "ms";
import env from "@/config/env";
import jwt, { SignOptions } from "jsonwebtoken";
import logger from "./logger";

export interface JwtPayload {
  jti?: string;
  id: string;
  username: string;
}

export class JwtUtils {
  private static readonly ACCESS_TOKEN_EXPIRES =
    env.JWT_ACCESS_EXPIRES ?? "15m";
  private static readonly REFRESH_TOKEN_EXPIRES =
    env.JWT_REFRESH_EXPIRES ?? "7d";

  private static readonly PRIVATE_KEY_PATH = env.JWT_PRIVATE_KEY_PATH!;
  private static readonly PUBLIC_KEY_PATH = env.JWT_PUBLIC_KEY_PATH!;

  private static getPrivateKey(): string {
    try {
      return fs.readFileSync(path.resolve(this.PRIVATE_KEY_PATH), "utf8");
    } catch (err) {
      throw new Error(
        `Failed to load private key from ${this.PRIVATE_KEY_PATH}`
      );
    }
  }

  private static getPublicKey(): string {
    try {
      return fs.readFileSync(path.resolve(this.PUBLIC_KEY_PATH), "utf8");
    } catch (err) {
      throw new Error(`Failed to load public key from ${this.PUBLIC_KEY_PATH}`);
    }
  }

  static generateAccessToken(payload: JwtPayload): string {
    const privateKey = this.getPrivateKey();
    const options: SignOptions = {
      algorithm: "ES256",
      expiresIn: this.ACCESS_TOKEN_EXPIRES as ms.StringValue,
    };
    return jwt.sign(payload, privateKey, options);
  }

  static generateRefreshToken(payload: JwtPayload): string {
    const privateKey = this.getPrivateKey();
    const options: SignOptions = {
      algorithm: "ES256",
      expiresIn: this.REFRESH_TOKEN_EXPIRES as ms.StringValue,
    };
    return jwt.sign(payload, privateKey, options);
  }

  static verifyAccessToken(token: string): JwtPayload {
    try {
      const publicKey = this.getPublicKey();
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ["ES256"],
      }) as JwtPayload;

      return decoded;
    } catch (err: any) {
      logger.error(err.message, "JWT verification error:");
      throw new Error(`Failed to verify access token: ${err.message}`);
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    try {
      const publicKey = this.getPublicKey();
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ["ES256"],
      }) as JwtPayload;

      return decoded;
    } catch (err: any) {
      logger.error(err.message, "JWT verification error:");
      throw new Error(`Failed to verify refresh token: ${err.message}`);
    }
  }

  static generateTokenPair(payload: JwtPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
