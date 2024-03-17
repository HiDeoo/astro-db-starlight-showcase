/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_CLIENT_ID: string
  readonly GITHUB_CLIENT_SECRET: string
  readonly R2_ACCOUNT_ID: string
  readonly R2_ACCESS_KEY_ID: string
  readonly R2_SECRET_ACCESS_KEY: string
  readonly R2_BUCKET_NAME: string
  readonly R2_BUCKET_PUBLIC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Locals {
    session: import('lucia').Session | null | undefined
    user: typeof import('astro:db').ShowcaseUser.$inferSelect | undefined
  }
}
