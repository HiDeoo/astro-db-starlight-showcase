import { db, eq, ShowcaseUser } from 'astro:db'
import { defineMiddleware } from 'astro:middleware'
import { verifyRequestOrigin } from 'lucia'

import { lucia } from './libs/auth'

// https://docs.astro.build/en/guides/middleware/#middleware-types
export const onRequest = defineMiddleware(async ({ cookies, locals, request, url }, next) => {
  if (!url.pathname.startsWith('/showcase/')) {
    return next()
  }

  // https://lucia-auth.com/guides/validate-session-cookies/astro
  if (request.method !== 'GET') {
    const originHeader = request.headers.get('Origin')
    const hostHeader = request.headers.get('Host')

    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return new Response(null, { status: 403 })
    }
  }

  locals.session = undefined
  locals.user = undefined

  const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId) {
    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId)

  locals.session = session

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie()
    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  } else {
    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }

    locals.user = await db.select().from(ShowcaseUser).where(eq(ShowcaseUser.id, user.id)).get()
  }

  return next()
})
