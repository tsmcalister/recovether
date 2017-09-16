import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './renderer/App'
import registerServiceWorker from './registerServiceWorker'
import 'typeface-roboto'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { createStores } from './renderer/stores'

const stores = createStores()

ReactDOM.render(
	<HashRouter>
		<Provider {...stores}>
			<App />
		</Provider>
	</HashRouter>,
	document.getElementById('root')
)
registerServiceWorker()
