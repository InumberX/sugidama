import remix from '@react-router/express'
import express from 'express'
import * as build from './index.js'

const app = express()
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000

app.all(
  '/*splat',
  remix.createRequestHandler({
    build,
  })
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
