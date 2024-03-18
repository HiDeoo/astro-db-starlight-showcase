import { and, db, desc, eq, isNotNull, isNull, ShowcaseEntry, ShowcaseUser, sql } from 'astro:db'
import { generateId } from 'lucia'

import { uploadImage, deleteImage } from './r2'

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

export async function addShowcaseEntry(user: ShowcaseUser, url: string, name: string, image: File) {
  const imageFileName = await uploadImage(image)

  try {
    await db.insert(ShowcaseEntry).values({
      id: generateId(36),
      userId: user.id,
      url: url,
      name: name,
      imageFileName,
    })
  } catch (error) {
    // If saving the entry fails, delete the image to avoid orphaned files.
    await deleteImage(imageFileName)

    throw error
  }
}

export function getUserShowcaseEntries(user: ShowcaseUser) {
  return db.select().from(ShowcaseEntry).where(eq(ShowcaseEntry.userId, user.id)).orderBy(desc(ShowcaseEntry.createdAt))
}

export async function deleteUsersShowcaseEntry(user: ShowcaseUser, id: string) {
  const entry = await db
    .select()
    .from(ShowcaseEntry)
    .where(and(eq(ShowcaseEntry.userId, user.id), eq(ShowcaseEntry.id, id)))
    .get()

  if (!entry) {
    throw new Error('Entry to delete not found.')
  }

  await deleteImage(entry.imageFileName)

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
