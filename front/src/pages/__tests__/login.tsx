import "@testing-library/jest-dom"
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { render, fireEvent, screen } from "@testing-library/react"
import Login from "../Login"
import { Provider } from "react-redux"
import configureStore from "../../state/store"

const apiServer = setupServer(
	rest.get("/users/1", (req, res, ctx) => {
		return res(ctx.json([]))
	})
)

const store = configureStore()

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>

beforeAll(() => {
	apiServer.listen({
		onUnhandledRequest: (req) => {
			console.log(req)
		},
	})
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: jest.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: jest.fn(), // deprecated
			removeListener: jest.fn(), // deprecated
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		})),
	})
})
afterEach(() => {
	apiServer.resetHandlers()
})
afterAll(() => apiServer.close())

test.skip("should handle server error", async () => {
	apiServer.use(
		rest.get("/users/1", (req, res, ctx) => {
			return res(
				ctx.status(500),
				ctx.json({ message: "Internal server error" })
			)
		})
	)
	const onLoginSucceed = jest.fn()

	render(
		<Wrapper>
			<Login onLoginSucceed={onLoginSucceed} />
		</Wrapper>
	)

	fireEvent.change(screen.getByPlaceholderText(/username/i), {
		target: { value: "nicolas@test.jp" },
	})
	fireEvent.change(screen.getByPlaceholderText(/password/i), {
		target: { value: "this-is-a-paassword" },
	})

	fireEvent.click(screen.getByText(/loginButton/g))

	await screen.getByText(/server-error/i)
	expect(window.location.pathname.includes("server-error"))
	expect(onLoginSucceed).toHaveBeenCalledTimes(0)
})

test("should not call the api if the password is not filled", () => {
	const onLoginSucceed = jest.fn()

	render(
		<Wrapper>
			<Login onLoginSucceed={onLoginSucceed} />
		</Wrapper>
	)

	fireEvent.change(screen.getByPlaceholderText(/username/i), {
		target: { value: "nicolas@test.jp" },
	})
	fireEvent.blur(screen.getByPlaceholderText(/password/i))

	fireEvent.click(
		screen.getByText(
			"app.paypay-performance-review-manager.login.loginButton"
		)
	)

	expect(onLoginSucceed).toHaveBeenCalledTimes(0)
})

test("should not call the api if the mail address is not filled", () => {
	const onLoginSucceed = jest.fn()

	render(
		<Wrapper>
			<Login onLoginSucceed={onLoginSucceed} />
		</Wrapper>
	)

	fireEvent.blur(screen.getByPlaceholderText(/username/i))
	fireEvent.change(screen.getByPlaceholderText(/password/i), {
		target: { value: "this-is-a-paassword" },
	})

	fireEvent.click(screen.getByText(/loginButton/g))

	expect(onLoginSucceed).toHaveBeenCalledTimes(0)
})
