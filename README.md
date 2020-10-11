# Pay Pay Full Stack Engineer Challenge

## Demo

### Admin Side - Add user / Performance review creation

![image](./images/admin-1.gif)

### Employee Side - Submit Performance review

![image](./images/employee-1.gif)

### Admin Side - View performance review detail

![image](./images/admin-2.gif)

### Black Box UI Tests using cypress - Login And Menu navigation tests

![image](./images/cypress-test.gif)

## Run the application

Required:

- NodeJS LTS 12.18.\*
- yarn (or npm)

### Back-end

```bash
$ cd ./back
$ yarn install
$ yarn start
```

### Front-end

```bash
$ cd ./front
$ yarn install
$ yarn start
```

### Default User

| Admin | Password |
| ----- | -------- |
| admin | admin    |

### Improvment

This application was produced in a short time frame. Some compromises had to be made. If the application had to evolved, here's what could be done to improve it:

- Increase the test coverage of both back-end and front-end. Due to time restriction, only few tests has been made, Black Box UI tests & one test file on back-end side. In a real world project, every use case of the application should be tested.
- Insead of using plain text api routes ([example](./front/src/api/authentication.ts#20)), all the route should be move to a config file or a metadata call on the API side
- Use express rate limit for registering new user to avoid performance issue. Indeed, every password is hashed using `bcrypt` and it takes ressources on the server side every time an admin create a user
- Reload the app logout the user. Should implment a `refresh_token` with the current `access_token` to avoid this. [more deails here](https://tools.ietf.org/html/rfc6749#section-1.5)
- The app currently use cookie to authenticate the user. However the security could be improved, especially to avoid `Cross-site request forgery attack` by using a `CSRF Token `https://portswigger.net/web-security/csrf/tokens
- This application is intended to be used internally within a company. It may be relevant to shift the responsibility of the authentication and authorization part to an Identity Provider / Identity Manager / Authorization server. Such kind of service can support multiple authentication protocol and can integrate with existing enterprise applications. Example: [Identity Server](https://identityserver.io/)
