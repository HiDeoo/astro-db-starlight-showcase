import { defineDb, defineTable, column, sql } from 'astro:db'

// import { PERMISSIONS } from '../src/libs/showcase'

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
    permissions: column.number({ default: 0 }),
  },
})

const ShowcaseEntry = defineTable({
  columns: {
    id: column.text({ primaryKey: true, default: sql`uuid()` }),
    userId: column.text({ references: () => ShowcaseUser.columns.id }),
    url: column.text({ unique: true }),
    name: column.text({ unique: true }),
    imageFileName: column.text({ unique: true }),
    approved: column.boolean({ default: false }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
    updatedAt: column.date({ optional: true }),
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
