// Dependency Imports
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// Local Imports
import { Auth0Provider } from "./Auth/react-auth0-spa";
import history from "./utils/history";
import config from "./Auth/auth_config.json";
import "./Styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Store from "./Store/Store";

// a function that routes user to the relevant location after login
const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    cacheLocation={config.cacheLocation}
  >
    <Store>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Store>
  </Auth0Provider>,
  document.getElementById("root")
);

if (process.env.NODE_ENV !== "development") console.log = () => {};
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
