import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bullseye, Button, ButtonVariant, ClipboardCopy, Popover, Spinner } from '@patternfly/react-core';
import { ShareAltIcon } from '@patternfly/react-icons';
import _ from 'lodash';

import { AuthContext } from '../../../../Auth';

const initialState = {
  loading: false,
  shortUrl: {}
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
        shortUrl: action.payload.shortUrl
      };
    default:
      return state;
  }
};

const ShareUrl = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const location = useLocation();

  const createShortUrl = () => {
    dispatch({ type: 'CREATE_SHORTURL_REQUEST' });
    fetch(`${BACKEND}/api/shortURL`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        url: `${location.pathname}${location.search}`
      })
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(shortUrl =>
        dispatch({
          type: 'CREATE_SHORTURL_SUCCESS',
          payload: { shortUrl }
        })
      )
      .catch(error => {
        props.showAlert('Could not create short URL 😔', 'danger');
      });
  };

  return (
    <Popover
      headerContent="Share the Link"
      onShow={createShortUrl}
      bodyContent={
        state.loading ? (
          <Bullseye>
            <Spinner />
          </Bullseye>
        ) : (
          <ClipboardCopy isReadOnly>{`${window.location.host}/go/${state.shortUrl.shortUrl}`}</ClipboardCopy>
        )
      }
    >
      <Button id="url-sharing" aria-label="URL Sharing" variant={ButtonVariant.secondary}>
        <ShareAltIcon />
      </Button>
    </Popover>
  );
};

export default ShareUrl;
