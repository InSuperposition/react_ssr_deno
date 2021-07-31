import {hydrate} from './client/mod.tsx'
import server, {ServerOpts} from './server/mod.tsx'

export default function runApp(options: ServerOpts) {
  hydrate(options.app, options.id)
  return server(options)
}
