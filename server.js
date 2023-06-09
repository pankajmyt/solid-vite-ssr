import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from "cors";
// import { render } from import('./dist/server/entry-server.js')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (p) => path.resolve(__dirname, p)

const app = express();
const port = 8080;

const isProd = process.env.NODE_ENV === 'production'

console.log(isProd);

const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

app.use(cors())

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  let template = indexProd
  // @ts-ignore

  let render = (await import('./dist/server/entry-server.js')).render

  const context = {}
  const appHtml = render(url, context)

  if (context.url) {
    // Somewhere a `<Redirect>` was rendered
    return res.redirect(301, context.url)
  }

  const html = template.replace(`<!--app-html-->`, appHtml)

  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})

async function createServer() {
  
  app.use(
    (await import('serve-static')).default(resolve('dist/client'), {
      index: false,
    }),
  )

  console.log(`starting server at ${port}`)
  app.listen(port)
}

createServer()