import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

try {
  await pool.query('CREATE TABLE IF NOT EXISTS "__drizzle_migrations" ("id" serial PRIMARY KEY, "hash" text NOT NULL UNIQUE, "created_at" bigint)')
  const files = (await readdir(path.resolve('drizzle'))).filter((file) => file.endsWith('.sql')).sort()
  for (const file of files) {
    const sql = await readFile(path.resolve('drizzle', file), 'utf8')
    const hash = file
    const applied = await pool.query('SELECT 1 FROM "__drizzle_migrations" WHERE "hash" = $1 LIMIT 1', [hash])
    if (applied.rowCount) continue
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      for (const statement of sql.split(/^--> statement-breakpoint\s*$/m).map((part) => part.trim()).filter(Boolean)) await client.query(statement)
      await client.query('INSERT INTO "__drizzle_migrations" ("hash", "created_at") VALUES ($1, $2)', [hash, Date.now()])
      await client.query('COMMIT')
      console.log(`Applied ${file}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally { client.release() }
  }
} finally {
  await pool.end()
}
