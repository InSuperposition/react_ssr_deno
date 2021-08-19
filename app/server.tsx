import React from 'react'
import ReactDOM from 'react-dom'

import {renderToString} from 'react-dom/server'
import {Html} from '/component/mod.tsx'
import {opine} from 'opine'
import {APP_NAME, CLIENT_NAME} from './constants.ts'

console.info('deno cwd', Deno.cwd())

const server = opine()

export function hydrate(App: () => JSX.Element, id: string) {
  return ReactDOM.hydrate(<App />, document.getElementById(id))
}

function AppDefault() {
  return (
    <Html fileName={CLIENT_NAME} id={APP_NAME}>
      Default App
    </Html>
  )
}

export async function createApp(
  App: () => JSX.Element,
  id = APP_NAME,
  name = CLIENT_NAME
) {
  // const App = await import(url)
  const {diagnostics, files} = await Deno.emit('./client.tsx', {
    bundle: 'module',
    importMapPath: '../import_map.json',
    compilerOptions: {
      lib: ['dom', 'es2020'],
      target: 'es5',
      sourceMap: true
    }
  })

  if (diagnostics) {
    console.log('diagnostics', Deno.formatDiagnostics(diagnostics))
  }

  if (files) {
    console.log('files', files)
  }

  console.log('APP', App)

  const html = `
    <!doctype html>
    ${renderToString(
      <Html fileName={name} id={id}>
        <App />
      </Html>
    )}`

  const clientFileName = `${name}.js`
  const clientSourceMapFileName = `${clientFileName}.map`

  // FIXME:
  // const sourceMap = JSON.parse(files['deno:///bundle.js.map'])
  // const sources = sourceMap.sources.map((val: string) => {
  //   const end = val.length - 1
  //   return val.substring(1, end)
  // })
  // const patchedSourceMap = {
  //   ...sourceMap,
  //   sources
  // }
  // console.log('patched source map', patchedSourceMap.sources)

  // server.use(`/${clientSourceMapFileName}`, (req, res, next) => {
  //   res
  //     .type('application/json')
  //     // FIXME: see https://github.com/denoland/deno/pull/10781
  //     .json(patchedSourceMap)
  // })

  server.use(`/${clientFileName}`, (_req, res) => {
    res
      .set('sourcemap', clientSourceMapFileName)
      .type('application/javascript')
      .send(files['deno:///bundle.js'])
  })

  server.use('/', (_req, res) => {
    res.type('text/html').send(html)
  })

  const port = 3000
  console.info(`React SSR App listening on port: ${port}`)
  return server.listen({port})
}
