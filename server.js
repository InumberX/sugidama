import { createRequestHandler } from '@react-router/express'
import express from 'express'
import * as build from './index.js'

const app = express()
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000

app.all(
  '*splat',
  createRequestHandler({
    build,
  })
)

app.listen(port, () => {
  console.log(`[server] listening on :${port}`)
})
