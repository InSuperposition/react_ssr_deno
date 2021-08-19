import React from 'react'
import ReactDOM from 'react-dom'
import {AppName} from './app.tsx'
import {APP_NAME} from '../app/constants.ts'

ReactDOM.hydrate(<AppName />, document.getElementById(APP_NAME))
