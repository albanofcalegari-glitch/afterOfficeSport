import './env.js'
import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import { teamsRouter } from './routes/teams.js'
import { friendlyMatchesRouter } from './routes/friendly-matches.js'
import { errorHandler } from './lib/errors.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/teams', teamsRouter)
app.use('/api/friendly-matches', friendlyMatchesRouter)

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`)
})
