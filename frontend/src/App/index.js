import React from 'react';
import { AuthProvider, ProtectedRoute, AuthConsumer } from './Auth';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ShareUrlRedirect from './components/ShareUrlRedirect';
import queryString from 'query-string';
import { Title, Bullseye, EmptyState, EmptyStateIcon } from '@patternfly/react-core';
import { withGoogleAnalytics } from './Analytics';

const App = () => {
  withGoogleAnalytics();

  const LoadingPlaceHolder = props => {
    const Spinner = () => (
      <span className="pf-c-spinner" role="progressbar" aria-valuetext="Loading...">
        <span className="pf-c-spinner__clipper" />
        <span className="pf-c-spinner__lead-ball" />
        <span className="pf-c-spinner__tail-ball" />
      </span>
    );
    return !props.isReady ? (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon variant="container" component={Spinner} />
          <Title size="lg">Loading</Title>
        </EmptyState>
      </Bullseye>
    ) : props.isAuthenticated ? (
      <Redirect to={queryString.parse(useLocation().search).redirect || '/dashboard'} />
    ) : (
      <Redirect to="/signin" />
    );
  };

  return (
    <AuthProvider>
      <AuthConsumer>
        {({ state }) => (
          <Switch>
            <Route
              exact
              path="/"
              component={() => <LoadingPlaceHolder isReady={state.isReady} isAuthenticated={state.isAuthenticated} />}
            />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <ProtectedRoute path="/go/:url" component={ShareUrlRedirect} />
            <Route path="/signin" component={Login} />
          </Switch>
        )}
      </AuthConsumer>
    </AuthProvider>
  );
};

export default App;
