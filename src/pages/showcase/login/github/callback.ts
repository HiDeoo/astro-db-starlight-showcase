import { OAuth2RequestError } from 'arctic'
import type { APIRoute } from 'astro'
import { db, eq, ShowcaseUser } from 'astro:db'
import type { Session } from 'lucia'

import { GITHUB_OAUTH_STATE_COOKIE_NAME, getGitHubUser, github, lucia } from '../../../../libs/auth'

export const prerender = false

// https://lucia-auth.com/tutorials/github-oauth/astro#validate-callback
export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies.get(GITHUB_OAUTH_STATE_COOKIE_NAME)?.value ?? null

  if (!code || !state || !storedState || state !== storedState) {
    return redirect('/showcase/login/')
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUser = await getGitHubUser(tokens.accessToken)
    const existingUser = await db.select().from(ShowcaseUser).where(eq(ShowcaseUser.gitHubId, githubUser.id)).get()

    let session: Session

    if (existingUser) {
      session = await lucia.createSession(existingUser.id, {})
    } else {
      const newUser = await db
        .insert(ShowcaseUser)
        .values({
          gitHubId: githubUser.id,
          gitHubLogin: githubUser.login,
          gitHubName: githubUser.name,
        })
        .returning()
        .get()

      session = await lucia.createSession(newUser.id, {})
    }

    const cookie = lucia.createSessionCookie(session.id)

    cookies.set(cookie.name, cookie.value, cookie.attributes)

    return redirect('/showcase/')
  } catch (error) {
    console.error('Failed to authenticate with GitHub:', error)

    const message =
      error instanceof OAuth2RequestError
        ? error.description ?? error.message
        : 'Something went wrong. Please try again.'

    return redirect(`/showcase/login/?error=${encodeURIComponent(message)}`)
  }
}
