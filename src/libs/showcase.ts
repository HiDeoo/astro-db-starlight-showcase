import { db, ShowcaseEntry, ShowcaseUser } from 'astro:db'

export function addShowcaseEntry(user: typeof ShowcaseUser.$inferSelect, url: string, name: string) {
  return db.insert(ShowcaseEntry).values({
    userId: user.id,
    url: url,
    name: name,
  })
}
