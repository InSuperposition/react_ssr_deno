import React from 'react'
import ReactDOM from 'react-dom'
import {renderToString} from 'react-dom/server'
import {APP_NAME, CLIENT_NAME} from './constants.ts'
import {Html} from '/component/mod.tsx'

console.info(1, import.meta.url, Deno.cwd())

// const params = new URL(import.meta.url).searchParams
// const id = params.get('id') ?? APP_NAME
// const path = params.get('path') ?? './demo.tsx'

// const { default: App } = await import(path)

const defaultOptions = {
  name: CLIENT_NAME
}

export async function createClient(
  path = './demo.tsx',
  id = APP_NAME,
  {name} = defaultOptions
) {
  console.info(2, import.meta.url, Deno.cwd())

  const emitResults = await Deno.emit('client.tsx', {
    bundle: 'module',
    importMapPath: '../import_map.json',
    compilerOptions: {
      jsx: 'react',
      // jsxFactory: undefined,
      // jsxFragmentFactory: undefined,
      lib: ['dom', 'es2020'],
      target: 'es2020',
      sourceMap: true
    }
  })

  console.log('emitResults', emitResults)

  return {
    name: `${name}.js`,
    code: emitResults.files['deno:///bundle.js'],
    map: emitResults.files['deno:///bundle.js.map']
  }
}
