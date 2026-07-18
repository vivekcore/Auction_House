import { betterAuth, type Auth, type BetterAuthOptions } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username, type BearerOptions } from "better-auth/plugins";
import { AccountModel } from "../models/accoountModel.js";
import dotenv from "dotenv";
import type { Db } from "mongodb";
import mongoose from "../db/db.js";

dotenv.config();

export let authInstance: Auth<BetterAuthOptions>;

export const getAuth = (): Auth<BetterAuthOptions> => {
  if (!authInstance) {
    const Db = mongoose.connection.db as Db
    if (!Db) {
      throw new Error("DB not connected yet. Call ConnectDB() first.");
    }
    authInstance = betterAuth<BetterAuthOptions>({
      database: mongodbAdapter(Db, {
        client: mongoose.connection.getClient(),
        usePlural: false,
      }),
      secret: process.env.BETTER_AUTH_SECRET,
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
              const balance = 1 + Math.random() * 10000;
              await AccountModel.insertOne({
                userId: new mongoose.Types.ObjectId(user.id),
                balance,
                availableBalance: balance,
              });
            },
          },
        },
      },
      socialProviders: {
        google: {
          prompt: "select_account",
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      },
      trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],
      advanced: {
        crossSubDomainCookies: {
          enabled: true,
        },
      },
    });
  }
  return authInstance;
};
