# EngineRoom
EngineRoom is a social media application for car enthusiasts.  It allows users to make posts, make comments, upload pictures of their cars, set a profile picture, and find friends who share car interests.  It’s a single page, fullstack application that uses React and Redux on the frontend and Node.js, Express, and MongoDB on the backend. The frontend is served by GitHub Pages and the backend runs on Heroku with a managed database provided by MongoDB Atlas. It was designed using Figma.

# Frontend
## Running this Project
This project was made with `create-react-app`, so it can be run in development with `npm start` or built for production with `npm run build`.

## Deployment
This project is currently deployed on Heroku here: [https://engineroom.wasserstein.dev](https://engineroom.wasserstein.dev).

# Backend
## Running this Project
Run this project locally with `node index.js`.  If the environment variable `MONGODB_URI` is set, it will connect to that URI as its database; otherwise, it will try to connect to MongoDB locally.

## Deployment
This project is currently deployed on Heroku and can be found here: [https://engineroom-api.herokuapp.com/](https://engineroom-api.herokuapp.com/).

## Frontend
The frontend code can be found here: [https://github.com/jwasserstein/engineroom-frontend](https://github.com/jwasserstein/engineroom-frontend).