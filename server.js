import { createRequestHandler } from '@react-router/express'
import express from 'express'
import * as build from './index.js'

const app = express()
const port = 3000

app.all(
  '*',
  createRequestHandler({
    build,
  })
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
