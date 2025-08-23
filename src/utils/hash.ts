import bcrypt from "bcrypt";

export const hash = async (raw: string): Promise<string> => {
  return await bcrypt.hash(raw, 10);
};

export const compareHash = async (
  raw: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(raw, hashed);
};
