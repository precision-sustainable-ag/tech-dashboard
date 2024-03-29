// Dependency Imports
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Local Imports
import { Auth0Provider } from './Auth/react-auth0-spa';
import history from './utils/history';
import config from './Auth/auth_config.json';
import './Styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import Store from './Store/Store';
// import store from './Store/newStore';

import { createStore } from 'redux';
import { allReducers } from './Store/reducers';

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

// a function that routes user to the relevant location after login
const onRedirectCallback = (appState) => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      cacheLocation={config.cacheLocation}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

if (process.env.NODE_ENV !== 'development') console.log = () => {};
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
process.env.NODE_ENV === 'development' ? serviceWorker.register() : serviceWorker.unregister();
