import { db, ShowcaseEntry } from 'astro:db'

// https://astro.build/db/seed
export default async function seed() {
  // TODO(HiDeoo)
  await db.insert(ShowcaseEntry).values([
    { url: 'url-1', title: 'title-1' },
    { url: 'url-2', title: 'title-2' },
  ])
}
