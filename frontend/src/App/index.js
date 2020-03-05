import React, { Component } from 'react';
import Dashboard from './components/Dashboard';
// import Login from './components/Login';

// export const UserContext = React.createContext();
// const initialState = {
//   isAuthenticated: false,
//   user: null,
//   token: null
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       localStorage.setItem('user', JSON.stringify(action.payload.user));
//       localStorage.setItem('token', JSON.stringify(action.payload.token));
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//         token: action.payload.token
//       };
//     case 'LOGOUT':
//       localStorage.clear();
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null
//       };
//     default:
//       return state;
//   }
// };

const App = () => {
  // const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    // <AuthContext.Provider
    //   value={{
    //     state,
    //     dispatch
    //   }}
    // >
    <Dashboard />
    // </AuthContext.Provider>
  );
};

export default App;
