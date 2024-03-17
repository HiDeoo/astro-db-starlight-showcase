import type { APIRoute } from 'astro'

import { lucia } from '../../libs/auth'

export const prerender = false

export const GET: APIRoute = async ({ redirect }) => {
  return redirect('/showcase/login/')
}

// https://lucia-auth.com/tutorials/github-oauth/astro#sign-out
export const POST: APIRoute = async ({ cookies, locals, redirect }) => {
  if (locals.session) {
    await lucia.invalidateSession(locals.session.id)

    const sessionCookie = lucia.createBlankSessionCookie()
    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  return redirect('/showcase/login')
}
