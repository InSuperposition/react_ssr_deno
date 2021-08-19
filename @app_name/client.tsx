import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.tsx'
import {APP_NAME} from '../app/constants.ts'

ReactDOM.hydrate(<App />, document.getElementById(APP_NAME))
