import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export const AuthContext = React.createContext();
const initialState = {
  isAuthenticated: false,
  username: null,
  email: null,
  token: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('username', JSON.stringify(action.payload.username));
      localStorage.setItem('email', JSON.stringify(action.payload.email));
      localStorage.setItem('token', JSON.stringify(action.payload.token));
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
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {!state.isAuthenticated ? <Login /> : <Dashboard />}
    </AuthContext.Provider>
  );
};

export default App;
