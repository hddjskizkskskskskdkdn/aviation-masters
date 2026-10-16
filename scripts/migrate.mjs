import { readFile } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

try {
  await client.query('BEGIN')
  await client.query('CREATE TABLE IF NOT EXISTS "__drizzle_migrations" ("id" serial PRIMARY KEY, "hash" text NOT NULL, "created_at" bigint)')
  const applied = await client.query('SELECT "hash" FROM "__drizzle_migrations" ORDER BY "id"')
  const known = new Set(applied.rows.map((row) => row.hash))
  const files = (await readdir('./drizzle')).filter((file) => file.endsWith('.sql')).sort()

  for (const file of files) {
    const hash = file
    if (known.has(hash)) continue
    const sql = await readFile(`./drizzle/${file}`, 'utf8')
    await client.query(sql)
    await client.query('INSERT INTO "__drizzle_migrations" ("hash", "created_at") VALUES ($1, $2)', [hash, Date.now()])
    console.log(`Applied migration ${file}`)
  }

  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  console.error(error)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
