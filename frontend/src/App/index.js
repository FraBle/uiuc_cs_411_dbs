import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './Login';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route> */}
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    );
  }
}
