import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./i18n"
import AppLoader from "./AppLoader"
import { Provider } from "react-redux"
import configureStore from "./state/store"

const store = configureStore()

ReactDOM.render(
	<Provider store={store}>
		<Suspense fallback={<AppLoader />}>
			<App />
		</Suspense>
	</Provider>,
	document.getElementById("root")
)
