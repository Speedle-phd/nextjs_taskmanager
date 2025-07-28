import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from './env'
import postgres from 'postgres'
import * as schema from './schema'
// You can specify any property from the node-postgres connection options

const pg = postgres(env.DATABASE_URL)
const db = drizzle(pg, {schema})
export {db,pg}