import React, {ReactNode} from 'react'
import ReactDOMServer from 'react-dom/server'
import HtmlIndex from './html_index.tsx'
import {opine} from 'opine'

const tsconfig = await Deno.readTextFile('../../tsconfig.json')
const config = JSON.parse(tsconfig)

const compilerOptions = {
  ...config.compilerOptions,
  lib: [
    ...config.compilerOptions.lib,
    'dom.asynciterable',
    'deno.ns',
    'deno.unstable'
  ]
}
/**
 * Create our client bundle - you could split this out into
 * a preprocessing step.
 */
const {diagnostics, files} = await Deno.emit('./client/mod.tsx', {
  bundle: 'module',
  compilerOptions,
  importMapPath: './import_map.json'
  // compilerOptions: {
  //   // TODO: https://deno.land/manual/typescript/configuration#targeting-deno-and-the-browser
  //   lib: [
  //     'dom',
  //     'dom.iterable',
  //     'dom.asynciterable',
  //     'deno.ns',
  //     'deno.unstable'
  //   ],
  //   target: 'es2020',
  //   sourceMap: true
  //   // inlineSourceMap: true
  // },
})

if (diagnostics) {
  console.log('diagnostics', diagnostics)
}

if (files) {
  console.log('files', files)
}

const srvr = opine()

export interface ServerOpts {
  app: () => JSX.Element
  fileName?: string
  id?: string
}

const defaultOptions: ServerOpts = {
  app: function DefaultApp() {
    return <HtmlIndex>Default App</HtmlIndex>
  },
  fileName: 'client',
  id: 'root'
}

export default function server(options = defaultOptions) {
  const {fileName, id, app: App} = options

  const html = ReactDOMServer.renderToString(
    <HtmlIndex fileName={fileName} id={id}>
      <App />
    </HtmlIndex>
  )

  const bundlePath = `${fileName}.js`
  const bundleMapPath = `${fileName}.js.map`

  // FIXME:
  const sourceMap = JSON.parse(files['deno:///bundle.js.map'])
  const sources = sourceMap.sources.map((val: string) => {
    const end = val.length - 1
    return val.substring(1, end)
  })
  const patchedSourceMap = {
    ...sourceMap,
    sources
  }
  console.log(patchedSourceMap.sources)

  srvr.use(bundlePath, (req, res, next) => {
    res
      .set('sourcemap', bundleMapPath)
      // .type('application/javascript')
      // FIXME: see https://github.com/denoland/deno/pull/10781
      .send(files['deno:///bundle.js'])
  })

  srvr.use(bundleMapPath, (req, res, next) => {
    res
      .type('application/json')
      // FIXME: see https://github.com/denoland/deno/pull/10781
      .json(patchedSourceMap)
  })

  srvr.use('/', (req, res, next) => {
    res.type('text/html').send(html)
  })

  const port = 3000

  srvr.listen({port})

  console.log(`React SSR App listening on port ${port}`)
}
