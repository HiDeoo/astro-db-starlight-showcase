/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_CLIENT_ID: string
  readonly GITHUB_CLIENT_SECRET: string
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
