import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthContext = React.createContext();

const initialState = {
  isReady: false,
  isAuthenticated: false,
  username: localStorage.getItem('username'),
  email: localStorage.getItem('email'),
  token: localStorage.getItem('token')
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        email: action.payload.email,
        token: action.payload.token
      };
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        username: null
      };
    case 'READY_SUCCESS':
      return {
        ...state,
        isReady: true,
        isAuthenticated: true
      };
    case 'READY_FAILURE':
      return {
        ...state,
        isReady: true,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

const ProtectedRoute = ({ component: Component, ...otherProps }) => {
  return (
    <AuthConsumer>
      {({ state }) => (
        <Route
          {...otherProps}
          render={props =>
            state.isAuthenticated ? (
              <Component {...props} />
            ) : (
              <Redirect to={otherProps.redirectTo ? otherProps.redirectTo : '/signin'} />
            )
          }
        />
      )}
    </AuthConsumer>
  );
};

const AuthProvider = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const fetchUsername = () => {
    fetch(`${BACKEND}/api/auth/username`, {
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    })
      .then(res => {
        if (res.ok) {
          return res.text();
        }
        throw res;
      })
      .then(username => {
        if (username === 'Not authenticated')
          dispatch({
            type: 'READY_FAILURE'
          });
        else
          dispatch({
            type: 'READY_SUCCESS'
          });
      })
      .catch(error => {
        dispatch({
          type: 'READY_FAILURE'
        });
      });
  };

  React.useEffect(fetchUsername, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{props.children}</AuthContext.Provider>;
};

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer, ProtectedRoute, AuthContext };
