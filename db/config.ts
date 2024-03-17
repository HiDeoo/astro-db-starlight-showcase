import { defineDb, defineTable, column } from "astro:db";

const ShowcaseEntry = defineTable({
  columns: {
    // TODO(HiDeoo) id?
    url: column.text(),
    title: column.text(),
    // TODO(HiDeoo) image

    // TODO(HiDeoo) createdAt
    // TODO(HiDeoo) validatedAt
    // TODO(HiDeoo) public
  },
});

export default defineDb({
  tables: { ShowcaseEntry },
});
