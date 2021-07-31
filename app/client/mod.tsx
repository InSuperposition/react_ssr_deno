import React from 'react'
import ReactDOM from 'react-dom'
import {appName} from '../constants.ts'

export function hydrate(App: () => JSX.Element, id = appName) {
  return ReactDOM.hydrate(<App />, document.getElementById(id))
}
