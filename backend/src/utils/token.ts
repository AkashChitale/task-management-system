import jwt from "jsonwebtoken";

const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "1d" });
};

const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
};

export { generateAccessToken, generateRefreshToken };