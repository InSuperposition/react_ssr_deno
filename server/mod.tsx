import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {opine} from 'opine'
import App from '../app/mod.tsx'

/**
 * Create our client bundle - you could split this out into
 * a preprocessing step.
 */
const {diagnostics, files} = await Deno.emit('./client/mod.tsx', {
  bundle: 'module',
  compilerOptions: {
    lib: ['dom', 'dom.iterable', 'es2020']
  },
  importMapPath: './import_map.json'
})

if (diagnostics) {
  console.log(diagnostics)
}

if (files) {
  console.log(files)
}

/**
 * Create our Opine server.
 */
const app = opine()
const browserBundlePath = '/browser.js'

const html = `
<html>
  <head>
    <script type="module" src="${browserBundlePath}"></script>
    <style>* { font-family: Helvetica; }</style>
  </head>
  <body>
    <div id="root">${ReactDOMServer.renderToString(<App />)}</div>
  </body>
</html >`

app.use(browserBundlePath, (req, res, next) => {
  res
    .type('application/javascript')
    // FIXME: see https://github.com/denoland/deno/pull/10781
    .send(files['deno:///bundle.js'])
})

app.use('/', (req, res, next) => {
  res.type('text/html').send(html)
})

const port = 3000

app.listen({port})

console.log(`React SSR App listening on port ${port}`)
