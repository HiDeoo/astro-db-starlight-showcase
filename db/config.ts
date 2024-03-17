import { defineDb, defineTable, column, sql } from 'astro:db'

// https://lucia-auth.com/reference/main/Session
const ShowcaseSession = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    expiresAt: column.date(),
    userId: column.text({ references: () => ShowcaseUser.columns.id }),
  },
})

const ShowcaseUser = defineTable({
  columns: {
    id: column.text({ primaryKey: true, default: sql`uuid()` }),
    gitHubId: column.number({ unique: true }),
    gitHubLogin: column.text({ unique: true }),
    gitHubName: column.text({ optional: true }),
  },
})

const ShowcaseEntry = defineTable({
  columns: {
    id: column.text({ primaryKey: true, default: sql`uuid()` }),
    userId: column.text({ references: () => ShowcaseUser.columns.id }),
    url: column.text({ unique: true }),
    name: column.text({ unique: true }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
    // TODO(HiDeoo) image
    // TODO(HiDeoo) public
  },
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    ShowcaseSession,
    ShowcaseUser,
    ShowcaseEntry,
  },
})
