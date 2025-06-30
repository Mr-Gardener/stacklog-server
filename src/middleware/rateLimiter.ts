import {rateLimit} from "express-rate-limit";

export const commentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limits each IP to 3 comments per minute
  message: "Too many comments from this IP. You can only comment 3 times per minute. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});