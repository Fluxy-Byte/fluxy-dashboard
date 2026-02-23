"use client"

import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_BETTER_AUTH_URL || "https://fluxy.egnehl.easypanel.host",
  plugins: [adminClient(), organizationClient()],
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  organization,
} = authClient
