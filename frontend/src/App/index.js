import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export const AuthContext = React.createContext();
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.username));
      //TODO: Replace with JWT token
      localStorage.setItem('token', JSON.stringify(action.payload.email));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.username,
        token: action.payload.email
      };
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null
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
