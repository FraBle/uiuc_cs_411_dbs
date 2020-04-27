import React from 'react';
import { Bullseye, ContextSelector, ContextSelectorItem, Spinner } from '@patternfly/react-core';

import { AuthContext } from '../../../../Auth';
import _ from 'lodash';
import moment from 'moment';

const initialState = {
  games: [],
  filteredGames: [],
  selectedGame: null,
  searchInput: '',
  dropdownIsOpen: false,
  loading: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_GAMES_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_GAMES_SUCCESS':
      return {
        ...state,
        loading: false,
        games: action.payload.games,
        filteredGames: action.payload.games
      };
    case 'FETCH_GAMES_FAILURE':
      return {
        ...state,
        loading: false
      };
    case 'SEARCH_GAME_INPUT':
      return {
        ...state,
        searchInput: action.payload.value
      };
    case 'TOGGLE_GAME_DROPDOWN':
      return {
        ...state,
        dropdownIsOpen: action.payload.isOpen
      };
    case 'SELECT_GAME':
      return {
        ...state,
        selectedGame: action.payload.game,
        dropdownIsOpen: !state.dropdownIsOpen
      };
    case 'SEARCH_GAME':
      return {
        ...state,
        filteredGames: _.filter(state.games, game =>
          _.includes(
            _.toLower(_.join(_.split(formatGame(game), /\s+/), '')),
            _.toLower(_.join(_.split(state.searchInput, /\s+/), ''))
          )
        )
      };
    default:
      return state;
  }
};

const formatGame = gameData =>
  `${moment(gameData.date).format('ll')}: ${gameData.homeCity} ${gameData.homeNickname} vs. ${gameData.visitorCity} ${
    gameData.visitorNickname
  }`;

const Game = props => {
  return formatGame(props.data);
};

const GameSearch = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (_.isNil(props.selectedMonthYear)) return;
    _.spread(fetchGames)(_.split(props.selectedMonthYear, '-'));
  }, [props.selectedMonthYear]);

  const fetchGames = (year, month) => {
    fetch(`${BACKEND}/api/game?month=${month}&year=${year}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(games =>
        dispatch({
          type: 'FETCH_GAMES_SUCCESS',
          payload: {
            games,
            loading: false
          }
        })
      )
      .catch(error => {
        dispatch({ type: 'FETCH_GAMES_FAILURE' });
        props.onError('Could not load games 😔');
      });
  };

  const onSearchInputChange = value => {
    dispatch({
      type: 'SEARCH_GAME_INPUT',
      payload: {
        value
      }
    });
  };

  const onDropdownToggle = (_, isOpen) =>
    dispatch({
      type: 'TOGGLE_GAME_DROPDOWN',
      payload: {
        isOpen
      }
    });

  const onDropdownSelect = (_, game) => {
    dispatch({
      type: 'SELECT_GAME',
      payload: {
        game: formatGame(game.props.data)
      }
    });
    props.onGameSelect(game.props.data);
  };

  return data.loading ? (
    <Bullseye>
      <Spinner size="md" />
    </Bullseye>
  ) : (
    <ContextSelector
      toggleText={data.selectedGame ? data.selectedGame : 'Select a Game'}
      onSearchInputChange={onSearchInputChange}
      isOpen={data.dropdownIsOpen}
      searchInputValue={data.searchInput}
      onToggle={onDropdownToggle}
      onSelect={onDropdownSelect}
      onSearchButtonClick={() => dispatch({ type: 'SEARCH_GAME' })}
      screenReaderLabel="Selected Game:"
      style={{ width: props.width }}
    >
      {data.filteredGames.map(game => (
        <ContextSelectorItem key={game.id}>
          <Game data={game} />
        </ContextSelectorItem>
      ))}
    </ContextSelector>
  );
};

export default GameSearch;
