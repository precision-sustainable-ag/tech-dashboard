// Dependency Imports
import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
// Local Imports
import { useAuth0 } from "../Auth/react-auth0-spa";

// Default Function
const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = (props) =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  path: PropTypes.string,
};
