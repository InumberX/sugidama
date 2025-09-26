import { createRequestHandler } from '@react-router/express'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ここがポイント：server/index.js を読む
import * as build from './server/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Amplify の static 配置に合わせて /static を配信
app.use(
  '/static',
  express.static(path.join(__dirname, 'static'), {
    immutable: true,
    maxAge: '1y',
  })
)

// React Router の SSR ハンドラ
app.all('*', createRequestHandler({ build }))

// Amplify は PORT を注入するので優先
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`[server] listening on :${port}`)
})
