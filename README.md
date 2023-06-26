# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. I have gained a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal was to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

## Links

- [API Domain](https://api.wtwr.australia.ai/items)

- [Production](https://wtwr.australia.ai)

- [Frontend Repo](https://github.com/ozansevkin/se_project_react)

## Built with

- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  - Express.js
    - Router
    - Controllers
    - Middlewares
      - Reqeust validation with Joi, celebrate and validator
      - Loggers for both requests and errors with winston
      - Centralized error handling
    - Password hashing with bcrypt
    - User authorization with jsonwebtoken
  - Mongoose
    - MongoDB connection
    - Schema
    - Model
- [Google Cloud](https://cloud.google.com/)
  - Linux VM (Virtual Machine) configuration
    - Node.js: javascript run time
    - MongoDB: NoSQL database
    - git: version control
    - pm2: process manager
    - nginx: request redirection
    - certbot: SSL certificate
  - SSH connection
- [MongoDB](https://www.mongodb.com/)
  - MongoDB Compass
- [ESLint](hhttps://eslint.org/)
  - Airbnb base configuration
- [Postman](https://www.postman.com/)
  - API testing

## Roadmap

- [] Add Unit Tests with JEST

## Contact

Ozan Sevkin - [@ozansevkin](https://twitter.com/ozansevkin) - [linkedin] - sevkinozan@gmail.com

<!-- MARKDOWN LINKS & IMAGES -->

[linkedin]: https://linkedin.com/in/ozansevkin
