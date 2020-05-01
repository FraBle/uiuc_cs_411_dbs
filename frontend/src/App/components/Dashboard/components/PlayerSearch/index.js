import React from 'react';
import {
  Bullseye,
  ContextSelector,
  ContextSelectorItem,
  EmptyState,
  EmptyStateIcon,
  Spinner,
  Title
} from '@patternfly/react-core';

import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { AuthContext } from '../../../../Auth';
import _ from 'lodash';

const initialState = {
  players: [],
  selectedPlayer: null,
  searchInput: '',
  dropdownIsOpen: false,
  loading: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PLAYERS_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_PLAYERS_SUCCESS':
      return {
        ...state,
        loading: false,
        players: action.payload.players
      };
    case 'FETCH_PLAYERS_FAILURE':
      return {
        ...state,
        loading: false
      };
    case 'SEARCH_PLAYER_INPUT':
      return {
        ...state,
        searchInput: action.payload.value
      };
    case 'TOGGLE_PLAYER_DROPDOWN':
      return {
        ...state,
        dropdownIsOpen: action.payload.isOpen
      };
    case 'SELECT_PLAYER':
      return {
        ...state,
        selectedPlayer: action.payload.player,
        dropdownIsOpen: !state.dropdownIsOpen
      };
    default:
      return state;
  }
};

const Player = props => {
  return props.name;
};

const PlayerSearch = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_PLAYERS_REQUEST'
    });
    fetchPlayers();
  }, []);

  const fetchPlayers = (limit = 10) => {
    fetch(
      `${BACKEND}/api/player?pageSize=${limit}&page=1&order=name&orderType=ASC` +
        (data.searchInput ? `&search=${data.searchInput}` : ''),
      {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      }
    )
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(players =>
        dispatch({
          type: 'FETCH_PLAYERS_SUCCESS',
          payload: {
            players: _.inRange(_.size(players), 0, 10)
              ? players
              : _.union(players, [{ id: new Date().getTime(), name: '...' }]),
            loading: false
          }
        })
      )
      .catch(error => {
        dispatch({ type: 'FETCH_PLAYERS_FAILURE' });
        props.onError('Could not load players 😔');
      });
  };

  const onSearchInputChange = value => {
    dispatch({
      type: 'SEARCH_PLAYER_INPUT',
      payload: {
        value
      }
    });
  };

  const onDropdownToggle = (_, isOpen) =>
    dispatch({
      type: 'TOGGLE_PLAYER_DROPDOWN',
      payload: {
        isOpen
      }
    });

  const onDropdownSelect = (_, player) => {
    if (player.props.name == '...') return onDropdownToggle(null, false);
    dispatch({
      type: 'SELECT_PLAYER',
      payload: {
        player: player.props.name
      }
    });
    props.onPlayerSelect(player.props.id, player.props.name);
  };

  return data.loading ? (
    <Bullseye>
      <Spinner size="md" />
    </Bullseye>
  ) : (
    <ContextSelector
      toggleText={data.selectedPlayer ? data.selectedPlayer : 'Select a Player'}
      onSearchInputChange={onSearchInputChange}
      isOpen={data.dropdownIsOpen}
      searchInputValue={data.searchInput}
      onToggle={onDropdownToggle}
      onSelect={onDropdownSelect}
      onSearchButtonClick={() => fetchPlayers()}
      screenReaderLabel="Selected Player:"
      style={{ width: props.width }}
    >
      {data.players.map(player => (
        <ContextSelectorItem key={player.id}>
          <Player id={player.id} name={player.name} />
        </ContextSelectorItem>
      ))}
    </ContextSelector>
  );
};

export default PlayerSearch;