import React from 'react'
import {renderToString} from 'react-dom/server'
import {Html} from '/component/mod.tsx'
import {opine} from 'opine'
import {createClient} from './client.tsx'
import {APP_NAME} from './constants.ts'

const server = opine()
const defaultOptions = {
  ssr: true
}
export async function createApp(
  path: string,
  id = APP_NAME,
  options = defaultOptions
) {
  const {name, code, map} = await createClient(path, id)
  const clientSourceMapFileName = `${name}.map`

  // FIXME:
  const sourceMap = JSON.parse(map)
  const sources = sourceMap.sources.map((val: string) => {
    const end = val.length - 1
    return val.substring(1, end)
  })
  const patchedSourceMap = {
    ...sourceMap,
    sources
  }
  console.log('patched source map', patchedSourceMap.sources)

  const {default: App} = await import(`${Deno.cwd()}/${path}`)
  const html = `
    <!doctype html>
    ${renderToString(
      <Html fileName={name} id={id}>
        <App />
      </Html>
    )}`
  server.use(`/${clientSourceMapFileName}`, (req, res, next) => {
    res
      .type('application/json')
      // FIXME: see https://github.com/denoland/deno/pull/10781
      .json(patchedSourceMap)
  })

  server.use(`/${name}`, (_req, res) => {
    res
      .set('sourcemap', clientSourceMapFileName)
      .type('application/javascript')
      .send(code)
  })

  server.use('/', (_req, res) => {
    res.type('text/html').send(html)
  })

  const port = 3000
  console.info(`React SSR App listening on port: ${port}`)
  return server.listen({port})
}
