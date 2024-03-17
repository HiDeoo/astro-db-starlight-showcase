import { db, ShowcaseEntry } from "astro:db";

export default async function seed() {
  await db.insert(ShowcaseEntry).values([
    { url: "url-1", title: "title-1" },
    { url: "url-2", title: "title-2" },
  ]);
}
