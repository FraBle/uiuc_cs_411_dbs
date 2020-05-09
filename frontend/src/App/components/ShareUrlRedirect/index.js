import React from 'react';
import { Title, Bullseye, EmptyState, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { useParams, Redirect } from 'react-router-dom';
import _ from 'lodash';

import { AuthContext } from '../../Auth';

const initialState = {
  loading: false,
  redirectUrl: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_SHORTURL_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'CREATE_SHORTURL_SUCCESS':
      return {
        ...state,
        loading: false,
        redirectUrl: action.payload.url
      };
    case 'FALLBACK':
      return {
        ...state,
        loading: false,
        redirectUrl: action.payload.url
      };
    default:
      return state;
  }
};

const ShareUrlRedirect = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  let { url } = useParams();

  React.useEffect(() => {
    getShortUrl(url);
  }, []);

  const getShortUrl = longUrl => {
    dispatch({ type: 'GET_SHORTURL_REQUEST' });

    fetch(`${BACKEND}/api/shortURL?shortURL=${longUrl}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(shortUrl =>
        dispatch({
          type: 'CREATE_SHORTURL_SUCCESS',
          payload: { url: shortUrl.url }
        })
      )
      .catch(error => {
        console.error(error);
        dispatch({
          type: 'FALLBACK',
          payload: { url: '/dashboard' }
        });
      });
  };

  return _.isNil(state.redirectUrl) ? (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon variant="container" component={Spinner} />
        <Title size="lg">Loading</Title>
      </EmptyState>
    </Bullseye>
  ) : (
    <Redirect to={state.redirectUrl} />
  );
};

export default ShareUrlRedirect;
