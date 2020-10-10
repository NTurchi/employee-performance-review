import { Store } from "redux"
import AppState from "./appState"

/**
 * Very basic store configuration for redux
 */
let configureStore: (initialState?: AppState) => Store

if (process.env.NODE_ENV === "production") {
	configureStore = require("./store.prod").default
} else {
	configureStore = require("./store.dev").default
}

export default configureStore
