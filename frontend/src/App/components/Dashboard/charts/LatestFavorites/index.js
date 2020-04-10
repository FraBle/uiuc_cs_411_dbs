import React from 'react';
import {
  Bullseye,
  Spinner,
  Title,
  EmptyState,
  EmptyStateIcon,
  SimpleList,
  SimpleListItem,
  SimpleListGroup
} from '@patternfly/react-core';
import { AuthContext } from '../../../../Auth';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const initialState = {
  hasData: false,
  hasError: false,
  loading: false,
  error: null,
  favoritePlayers: [],
  favoriteFranchises: [],
};


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FAVORITES_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_FAVORITES_SUCCESS':
      return {
        ...state,
        loading: false,
        hasData: true,
        favoritePlayers: action.payload.favoritePlayers,
        favoriteFranchises: action.payload.favoriteFranchises
      };
    case 'FETCH_FAVORITES_FAILURE':
      return {
        ...state,
        loading: false,
        hasError: true,
        error: action.payload.error
      };
    default:
      return state;
  }
};

const LatestFavorites = props => {
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_FAVORITES_REQUEST'
    });
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch(
        `${BACKEND}/api/user/${authState.username}/favorite/player?pageSize=4&page=1&order=createdAt&orderType=DESC`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      ),
      fetch(
        `${BACKEND}/api/user/${authState.username}/favorite/franchise?pageSize=4&page=1&order=createdAt&orderType=DESC`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      )
    ])
      .then(([players, franchises]) => Promise.all([players.json(), franchises.json()]))
      .then(([playersJson, franchisesJson]) =>
        dispatch({
          type: 'FETCH_FAVORITES_SUCCESS',
          payload: {
            favoritePlayers: playersJson,
            favoriteFranchises: franchisesJson
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_FAVORITES_FAILURE',
          payload: {
            error
          }
        })
      );
  };

  return !data.hasData ? (
    <div style={{ minWidth: '300px', minHeight: '300px' }}>
      <Bullseye>
        <Spinner />
      </Bullseye>
    </div>
  ) : data.hasError ? (
    <div style={{ minWidth: '300px', minHeight: '300px' }}>
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={ExclamationTriangleIcon} />
          <Title size="lg">Could not load data.</Title>
        </EmptyState>
      </Bullseye>
    </div>
  ) : (
    <div style={{ minWidth: '300px', minHeight: '300px' }}>
      <SimpleList aria-label="Grouped List Example">
        <SimpleListGroup title="Franchises" id="franchises">
          {data.favoriteFranchises.map(franchise => (
            <SimpleListItem key={'franchise-' + franchise.id}>{franchise.nickname}</SimpleListItem>
          ))}
        </SimpleListGroup>
        <SimpleListGroup title="Players" id="players">
          {data.favoritePlayers.map(player => (
            <SimpleListItem key={'player-' + player.id}>{player.name}</SimpleListItem>
          ))}
        </SimpleListGroup>
      </SimpleList>
    </div>
  );
};

export default LatestFavorites;
