import './env.js'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import { teamsRouter } from './routes/teams.js'
import { friendlyMatchesRouter } from './routes/friendly-matches.js'
import { errorHandler } from './lib/errors.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webDist = path.join(__dirname, '../../web/dist')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/teams', teamsRouter)
app.use('/api/friendly-matches', friendlyMatchesRouter)

app.use(express.static(webDist))

app.get('*', (_req, res) => {
  res.sendFile(path.join(webDist, 'index.html'))
})

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`)
})
