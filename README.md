# Telestrations Frontend

This is the React single-page application for Telestrations.


## Navigating Codebase
This repository was originally generated from the create-react-app tool and therefore follows all common React conventions. 
- `public/` Static files that are included in the build.
  - `index.html` The main HTML file that the React code is injected into. Global CSS, meta tags, etc. go here.
  - Other files such as `robots.txt` and favicons are located here.
- `src/` The React application and all components.
  - `index.js` The main Javascript file that bootstraps React and injects it into the webpage. All global CSS files are imported here.
  - `config.js` Configuration file for storing constants.
  - `App.jsx` The main React component for the application that wraps the whole application in React Router and does any global component setup.
  - `services/` Miscellaneous Javascript modules that aren't React components but serve specific purposes.
    - `client.js` Colyseus client module that handles lobby and game room connections.
    - `color-effects.js` Javascript module that handles the random backgound color generation.
  - `pages/` React pages and their specific subcomponents.
  - `components/` Global React components.

## Running
Refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

## Deploying
Deployment is extremely simple as this frontend application can be served as a static website on any number of platforms. Simply build the frontend and host the `build/` directory on a web server.
- `npm install` - Installs all required dependencies.
- `npm run build` - Builds the application into static HTML, CSS, and JS files in the `build/` directory.
- `npm start` - Runs the app in development mode. Opens on http;//localhost:3000 to view on browser.
