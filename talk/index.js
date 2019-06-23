import React from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import Redbox from "redbox-react";
import Root from './Root';
import routes from './routes';
const CustomErrorReporter = ({ error }) => <Redbox error={ error } />;

CustomErrorReporter.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired
};
const renderApp = appRoutes => {
  render(
  <AppContainer errorReporter={CustomErrorReporter}>
    <Root routes={appRoutes} />
  </AppContainer>,
  document.getElementById("root")
  )
}
renderApp(routes)

if (module.hot) {
  module.hot.accept('./routes', () => {
    const newRoutes = require('./routes').default;
    renderApp(newRoutes);
  });
}
