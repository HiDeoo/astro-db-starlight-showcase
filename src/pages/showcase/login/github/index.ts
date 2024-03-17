import { generateState } from 'arctic'
import type { APIRoute } from 'astro'

import { GITHUB_OAUTH_STATE_COOKIE_NAME, github } from '../../../../libs/auth'

export const prerender = false

// https://lucia-auth.com/tutorials/github-oauth/astro#create-authorization-url
export const GET: APIRoute = async ({ cookies, redirect }) => {
  const state = generateState()
  const url = await github.createAuthorizationURL(state)

  cookies.set(GITHUB_OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: '/',
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  })

  return redirect(url.toString())
}
