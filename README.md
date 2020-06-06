required npm packages:
1. express
2. graphql
3. ws
4. body-parser

optional npm packages:
1. cors
2. esm
3. lodash

main parts:
1. ws-server
2. graphql-subscriptions
2. pubsub-system
3. async-iterator

The project has at the moment an own-grown json-db with file watch capabilities. The json-db is only a placeholder for a real db! It is used to stimulate working with several instances of the server and still to maintain the pub-sub system for all connected clients.

Frontend is now attached as well. It is a create-react-app project. Can be found in `frontend/client`.
To start the entire development process run in the project root `yarn dev`. That would start the server and the client in development mode.
To run in "production" run the build command for the create-react-app project in `frontend/client` => `yarn build`.
Then in the root folder `yarn start`.

Redux is integrated on the frontend.