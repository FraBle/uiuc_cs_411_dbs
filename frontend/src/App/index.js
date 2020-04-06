import React from 'react';
import { AuthProvider, ProtectedRoute, AuthConsumer } from './Auth';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {
  Title,
  Bullseye,
  EmptyState,
  EmptyStateIcon
} from '@patternfly/react-core';

const App = () => {
  const LoadingPlaceHolder = (props) => {
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
      <Redirect to="/dashboard" />
    ) : (
      <Redirect to="/signin" />
    );
  };

  return (
    <Router>
      <AuthProvider>
        <AuthConsumer>
          {({ state }) => (
            <Switch>
              <Route exact path="/" component={() => <LoadingPlaceHolder isReady={state.isReady} isAuthenticated={state.isAuthenticated} />}
              />
              <ProtectedRoute path="/dashboard" component={Dashboard} />
              <Route path="/signin" component={Login} />
            </Switch>
          )}
        </AuthConsumer>
      </AuthProvider>
    </Router>
  );
};

export default App;


/*
<ProtectedRoute path="/forms" component={FormList} />
<Route component={PageNotFound} />
*/
