import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  MONGODB_URI: z.string(),
  ENVIRONMENT: z.enum(["development", "production", "test"]),
  HTTP_SECURE_OPTION: z.string(),
  ACCESS_CONTROL_ORIGIN: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),
  GMAIL_USER: z.email(),
  GMAIL_APP_PASSWORD: z.string(),
  LIVEKIT_URL: z.string(),
  LIVEKIT_API_KEY: z.string(),
  LIVEKIT_API_SECRET: z.string(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  SERVER_BASE_URI: z.string()
});

export const env = envSchema.parse(process.env);
