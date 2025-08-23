import { compareHash, hash } from "@/utils/hash";
import { Document, model, ObjectId, Schema } from "mongoose";

export interface IRefreshToken {
  jti: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: IRefreshToken[];
  addRefreshToken: (entry: Partial<IRefreshToken>) => void;
  correctPassword: (password: string) => Promise<boolean>;
}

const refreshTokenSchema = new Schema(
  {
    jti: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    id: { type: Schema.Types.UUID, ref: "User" },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    refreshTokens: { type: [refreshTokenSchema], default: [], select: false },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password);
});

userSchema.methods.correctPassword = async function (
  password: string
): Promise<boolean> {
  return await compareHash(password, this.password);
};

userSchema.methods.addRefreshToken = function (
  this: IUser,
  token: Partial<IRefreshToken>
) {
  this.refreshTokens.push(token as IRefreshToken);
};

userSchema.methods.removeRefreshToken = function (this: IUser, jti: string) {
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.jti !== jti);
};

export default model<IUser>("User", userSchema);
