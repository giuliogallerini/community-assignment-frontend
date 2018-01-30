import React from 'react'
import ReactDOM from 'react-dom'
// import { ConnectedRouter as Router } from 'react-router-redux'
import { Provider } from 'react-redux'
import store, { history } from './store'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>, document.getElementById('root'))

registerServiceWorker()
