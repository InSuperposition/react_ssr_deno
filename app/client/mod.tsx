import React from 'react'
import ReactDOM from 'react-dom'
export function hydrate(App: () => JSX.Element, id = 'root') {
  return ReactDOM.hydrate(<App />, document.getElementById(id))
}
