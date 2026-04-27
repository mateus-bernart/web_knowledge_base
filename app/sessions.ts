import { createCookieSessionStorage } from "react-router";
import type { Toast } from "./types";

type SessionData = {
  toast?: Toast;
};

const sessionSecret = process.env.SESSION_SECRET || "dev-secret";

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
