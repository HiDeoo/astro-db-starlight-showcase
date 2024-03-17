import { and, db, desc, eq, isNotNull, isNull, ShowcaseEntry, ShowcaseUser, sql } from 'astro:db'

export const PERMISSIONS = {
  default: 0,
  admin: 2,
}

export function getApprovedShowcaseEntries() {
  return db.select().from(ShowcaseEntry).where(eq(ShowcaseEntry.approved, true)).orderBy(desc(ShowcaseEntry.createdAt))
}

export function getPristineUnapprovedShowcaseEntries() {
  return db
    .select()
    .from(ShowcaseEntry)
    .where(and(eq(ShowcaseEntry.approved, false), isNull(ShowcaseEntry.updatedAt)))
    .orderBy(desc(ShowcaseEntry.createdAt))
}

export function getTouchedUnapprovedShowcaseEntries() {
  return db
    .select()
    .from(ShowcaseEntry)
    .where(and(eq(ShowcaseEntry.approved, false), isNotNull(ShowcaseEntry.updatedAt)))
    .orderBy(desc(ShowcaseEntry.createdAt))
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

export function toggleShowcaseEntryApproval(id: string, approved: boolean) {
  return db
    .update(ShowcaseEntry)
    .set({ approved, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(ShowcaseEntry.id, id))
}

export function isUserAdmin(user: ShowcaseUser) {
  return user.permissions & PERMISSIONS.admin
}

type ShowcaseUser = typeof ShowcaseUser.$inferSelect
export type ShowcaseEntry = typeof ShowcaseEntry.$inferSelect
