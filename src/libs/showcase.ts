import { and, db, desc, eq, ShowcaseEntry, ShowcaseUser } from 'astro:db'

export const PERMISSIONS = {
  default: 0,
  admin: 2,
}

export function getApprovedShowcaseEntries() {
  // TODO(HiDeoo) public
  return db.select().from(ShowcaseEntry).orderBy(desc(ShowcaseEntry.createdAt))
}

export function addShowcaseEntry(user: ShowcaseUser, url: string, name: string) {
  return db.insert(ShowcaseEntry).values({
    userId: user.id,
    url: url,
    name: name,
  })
}

export function getUserShowcaseEntries(user: ShowcaseUser) {
  return db.select().from(ShowcaseEntry).where(eq(ShowcaseEntry.userId, user.id)).orderBy(desc(ShowcaseEntry.createdAt))
}

export function deleteUsersShowcaseEntry(user: ShowcaseUser, id: string) {
  return db.delete(ShowcaseEntry).where(and(eq(ShowcaseEntry.userId, user.id), eq(ShowcaseEntry.id, id)))
}

export function isUserAdmin(user: ShowcaseUser) {
  return user.permissions & PERMISSIONS.admin
}

type ShowcaseUser = typeof ShowcaseUser.$inferSelect
export type ShowcaseEntry = typeof ShowcaseEntry.$inferSelect
