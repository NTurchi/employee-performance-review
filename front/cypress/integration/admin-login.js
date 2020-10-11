describe("Performance Review Manager - Login tests", () => {
	beforeEach(() => {
		Cypress.Cookies.preserveOnce("Authentication")
	})
	const fillUsernamePassword = (username, password) => {
		cy.get("#login_username").clear().type(username)
		cy.get("#login_password").clear().type(password)
	}
	it("should not login if user is invalid", () => {
		cy.visit("http://localhost:3000/login")
		fillUsernamePassword("admin", "wrong password")
		cy.contains("Login").click()
		cy.url().should("include", "/login")
	})

	it("should login on admin side", () => {
		fillUsernamePassword("admin", "admin")
		cy.contains("Login").click()
		cy.url().should("include", "/home/admin-rev")
	})

	it("should go on user list and come back to performance review list", () => {
		cy.contains("Users").click()
		cy.url().should("include", "/home/admin-us")
		cy.contains("Manage Users").should("not.be.hidden")

		cy.contains("Perfomance Reviews").click()
		cy.url().should("include", "/home/admin-rev")
		cy.contains("Manage Performance Reviews").should("not.be.hidden")
	})
})
