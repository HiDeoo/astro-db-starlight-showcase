import { AstroDBAdapter } from 'lucia-adapter-astrodb'
import { GitHub } from 'arctic'
import { db, ShowcaseSession, ShowcaseUser } from 'astro:db'
import { Lucia } from 'lucia'

export const GITHUB_OAUTH_STATE_COOKIE_NAME = 'adss-github-oauth-state'

// https://github.com/pilcrowOnPaper/lucia-adapter-astrodb
const adapter = new AstroDBAdapter(db, ShowcaseSession, ShowcaseUser)

// https://lucia-auth.com/reference/main/Lucia/
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
    name: 'adss-auth-session',
  },
  // https://lucia-auth.com/basics/users#define-user-attributes
  getUserAttributes: (attributes) => ({
    githubId: attributes.gitHubId,
    githubLogin: attributes.gitHubLogin,
    gitHubName: attributes.gitHubName,
  }),
})

// https://arctic.js.org/providers/github
export const github = new GitHub(import.meta.env.GITHUB_CLIENT_ID, import.meta.env.GITHUB_CLIENT_SECRET)

// https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
export async function getGitHubUser(token: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok || response.status !== 200) {
    throw new Error('Failed to fetch GitHub profile.')
  }

  return response.json() as Promise<GitHubUser>
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  gitHubId: string
  gitHubLogin?: string
  gitHubName: string
}

interface GitHubUser {
  id: number
  login: string
  name?: string
}
