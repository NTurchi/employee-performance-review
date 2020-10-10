import { createStore } from "redux"
import rootReducer from "./ducks"
import AppState from "./appState"

export default function configureStore(initialState?: AppState) {
	return createStore(rootReducer, initialState)
}
