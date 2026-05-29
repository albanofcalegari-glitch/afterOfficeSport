import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: parseInt(process.env.PORT || '3001', 10),
}
