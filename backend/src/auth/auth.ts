import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { AccountModel } from "../models/accoountModel.js";
import dotenv from "dotenv";
import type { Db } from "mongodb";
import mongoose from "../db/db.js";

dotenv.config();

export let auth: ReturnType<typeof betterAuth> | undefined;
export function getAuth() {
  if (!auth) {
    throw new Error("Auth not initialized. Call createAuth() first.");
  }
  return auth;
}
export function createAuth() {
  if (auth) return auth;
  //@ts-ignore
  auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.db as Db, {
      usePlural: false,
    }),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    basePath: "/api/v1/auth",

    emailAndPassword: {
      enabled: true,
    },

    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 20,
        displayUsernameValidator: (displayUsername) => {
          return /^[a-zA-Z0-9_-]+$/.test(displayUsername);
        },
      }),
    ],

    user: {
      additionalFields: {
        image: {
          type: "string",
          required: false,
          defaultValue: "https://placehold.net/avatar.svg",
        },
        usernameSetup: {
          type: "boolean",
          defaultValue: false,
        },
      },
    },

    databaseHooks: {
      user: {
        create: {
          after: async (user, context) => {
            await AccountModel.insertOne({
              userId: user.id,
              balance: 1 + Math.random() * 10000,
            });
          },
        },
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],
  });
}
