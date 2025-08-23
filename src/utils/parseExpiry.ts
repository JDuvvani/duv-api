export const parseExpiry = (exp: string): number => {
  const match = /^(\d+)([smhd])$/.exec(exp);
  if (!match) {
    throw new Error(`Invalid expiry format: ${exp}`);
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000; // seconds
    case "m":
      return value * 60 * 1000; // minutes
    case "h":
      return value * 60 * 60 * 1000; // hours
    case "d":
      return value * 24 * 60 * 60 * 1000; // days
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
};
