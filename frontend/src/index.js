import React from 'react';
import ReactDOM from 'react-dom';
import '@patternfly/react-core/dist/styles/base.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

ReactDOM.render(
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>
      <App />
    </QueryParamProvider>
  </Router>,
  document.getElementById('root')
);
