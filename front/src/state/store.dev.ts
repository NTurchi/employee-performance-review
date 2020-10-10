import { createStore, applyMiddleware, compose, Store } from "redux"
import reduxImmutableStateInvariant from "redux-immutable-state-invariant"
import thunk from "redux-thunk"
import AppState from "./appState"
import { logger } from "redux-logger"
import rootReducer from "./ducks"

export default function configureStore(initialState?: AppState): Store {
	const composeEnhancers =
		(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // add support for Redux dev tools

	return createStore(
		rootReducer,
		initialState,
		composeEnhancers(
			applyMiddleware(logger, thunk, reduxImmutableStateInvariant()) // last one check mutation error in our state.
		)
	)
}
