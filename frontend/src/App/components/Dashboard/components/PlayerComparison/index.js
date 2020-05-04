import React from 'react';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  ContextSelector,
  ContextSelectorItem,
  EmptyState,
  EmptyStateIcon,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title
} from '@patternfly/react-core';

import { Table, cellWidth, TableBody, TableHeader, textCenter } from '@patternfly/react-table';
import { ExclamationTriangleIcon, StarIcon, OutlinedStarIcon } from '@patternfly/react-icons';
import { AuthContext } from '../../../../Auth';
import moment from 'moment';
import _ from 'lodash';
import Avatar from 'react-avatar';
import PlaceholderChart from '../../charts/PlaceholderChart';

const initialState = {
  players: [],
  filteredPlayers: [[], []],
  selectedPlayer: [null, null],
  selectedPlayerData: [{}, {}],
  searchPlayer: ['', ''],
  dropdownIsOpen: [false, false],
  error: null,
  loading: true,
  sportDbLoading: [false, false],
  sportDbError: [null, null],
  selectedPlayerSportsDb: [{}, {}]
};

const playerDataColumns = [
  {
    title: '',
    transforms: [cellWidth(40)],
    cellTransforms: [textCenter]
  },
  {
    title: '',
    transforms: [cellWidth(20)],
    cellTransforms: [textCenter]
  },
  {
    title: '',
    transforms: [cellWidth(40)],
    cellTransforms: [textCenter]
  }
];

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PLAYERS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PLAYERS_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        players: action.payload.players,
        filteredPlayers: [action.payload.players, action.payload.players]
      };
    case 'FETCH_PLAYERS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case 'SEARCH_PLAYER_INPUT':
      return {
        ...state,
        searchPlayer: Object.assign([...state.searchPlayer], { [action.payload.pos]: action.payload.value })
      };
    case 'TOGGLE_PLAYER_DROPDOWN':
      return {
        ...state,
        dropdownIsOpen: Object.assign([...state.dropdownIsOpen], {
          [action.payload.pos]: action.payload.isOpen
        })
      };
    case 'SELECT_PLAYER':
      return {
        ...state,
        selectedPlayer: Object.assign([...state.selectedPlayer], { [action.payload.pos]: action.payload.value }),
        selectedPlayerData: Object.assign([...state.selectedPlayerData], {
          [action.payload.pos]: state.players.find(player => player.name === action.payload.value)
        }),
        dropdownIsOpen: Object.assign([...state.dropdownIsOpen], {
          [action.payload.pos]: !state.dropdownIsOpen[action.payload.pos]
        })
      };
    case 'SEARCH_PLAYER':
      return {
        ...state,
        filteredPlayers: Object.assign([...state.filteredPlayers], {
          [action.payload.pos]:
            state.searchPlayer[action.payload.pos] === ''
              ? state.players
              : state.players.filter(player =>
                  _.includes(
                    _.toLower(_.join(_.split(player.name, /\s+/), '')),
                    _.toLower(_.join(_.split(state.searchPlayer[action.payload.pos], /\s+/), ''))
                  )
                )
        })
      };
    case 'FAVORITE_TOGGLED':
      const player = action.payload.player;
      player.isFavorite = !player.isFavorite;
      return {
        ...state,
        players: Object.assign([...state.players], { [state.players.findIndex(el => el.id === player.id)]: player }),
        selectedPlayerData: Object.assign([...state.selectedPlayerData], {
          [action.payload.pos]: player
        })
      };
    case 'FETCH_SPORTSDB_REQUEST':
      return {
        ...state,
        sportDbLoading: [true, true],
        sportDbError: [null, null]
      };
    case 'FETCH_SPORTSDB_SUCCESS':
      return {
        ...state,
        sportDbLoading: [false, false],
        sportDbError: [null, null],
        selectedPlayerSportsDb: Object.assign([...state.selectedPlayerSportsDb], {
          [action.payload.pos]: action.payload.player
        })
      };
    case 'FETCH_SPORTSDB_FAILURE':
      return {
        ...state,
        sportDbLoading: [false, false],
        sportDbError: Object.assign([...state.sportDbError], {
          [action.payload.pos]: action.payload.error
        })
      };
    default:
      return state;
  }
};
const PlayerComparison = props => {
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_PLAYERS_REQUEST'
    });
    fetchPlayers();
  }, []);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_SPORTSDB_REQUEST'
    });
    if (data.selectedPlayer[0] !== _.get(data.selectedPlayerSportsDb[0], 'strPlayer', null))
      fetchSportsDb(data.selectedPlayer[0], 0);
    if (data.selectedPlayer[1] !== _.get(data.selectedPlayerSportsDb[1], 'strPlayer', null))
      fetchSportsDb(data.selectedPlayer[1], 1);
  }, [data.selectedPlayer]);

  const fetchPlayers = () => {
    fetch(`${BACKEND}/api/player?pageSize=2000&page=1&order=name&orderType=ASC`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(players =>
        dispatch({
          type: 'FETCH_PLAYERS_SUCCESS',
          payload: {
            players,
            loading: false
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_PLAYERS_FAILURE',
          payload: {
            error
          }
        })
      );
  };

  const fetchSportsDb = (playerName, pos) => {
    if (!playerName) return;
    fetch(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=${playerName}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(players =>
        dispatch({
          type: 'FETCH_SPORTSDB_SUCCESS',
          payload: {
            player: _.head(players.player),
            pos
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_SPORTSDB_FAILURE',
          payload: {
            error,
            pos
          }
        })
      );
  };

  const selectedPlayer = pos => (data.selectedPlayer[pos] ? data.selectedPlayer[pos] : 'Select a Player');

  const onSearchInputChange = (pos, value) => {
    dispatch({
      type: 'SEARCH_PLAYER_INPUT',
      payload: {
        pos,
        value
      }
    });
  };

  const onDropdownToggle = (pos, isOpen) =>
    dispatch({
      type: 'TOGGLE_PLAYER_DROPDOWN',
      payload: {
        pos,
        isOpen
      }
    });

  const onDropdownSelect = (pos, value) => {
    dispatch({
      type: 'SELECT_PLAYER',
      payload: {
        pos,
        value
      }
    });
  };

  const onSearchButtonClick = pos =>
    dispatch({
      type: 'SEARCH_PLAYER',
      payload: {
        pos
      }
    });

  const dropdown = pos =>
    data.loading ? (
      <Bullseye>
        <Spinner />
      </Bullseye>
    ) : data.error ? (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={ExclamationTriangleIcon} />
          <Title size="lg">Could not load data.</Title>
        </EmptyState>
      </Bullseye>
    ) : (
      <ContextSelector
        toggleText={selectedPlayer(pos)}
        onSearchInputChange={value => onSearchInputChange(pos, value)}
        isOpen={data.dropdownIsOpen[pos]}
        searchInputValue={data.searchPlayer[pos]}
        onToggle={(_, isOpen) => onDropdownToggle(pos, isOpen)}
        onSelect={(_, value) => onDropdownSelect(pos, value)}
        onSearchButtonClick={() => onSearchButtonClick(pos)}
        screenReaderLabel="Selected Player:"
      >
        {data.filteredPlayers[pos].map(player => (
          <ContextSelectorItem key={player.id}>{player.name}</ContextSelectorItem>
        ))}
      </ContextSelector>
    );

  const photo = pos =>
    _.get(data.selectedPlayerSportsDb[pos], 'strThumb') ? (
      <Bullseye>
        <Avatar src={data.selectedPlayerSportsDb[pos].strThumb} color="#ecedec" size="250px" round />
      </Bullseye>
    ) : (
      <Bullseye>
        <Avatar value={`P${pos + 1}`} color="#ecedec" size="250px" round />
      </Bullseye>
    );

  const playerDataRows = [
    {
      cells: [
        data.selectedPlayerData[0].hasOwnProperty('isFavorite') ? (
          <React.Fragment>
            <Button
              variant="plain"
              aria-label="Favorite"
              onClick={() => onToggleFavorite(data.selectedPlayerData[0], 0)}
            >
              {data.selectedPlayerData[0].isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        ),
        'Favorite',
        data.selectedPlayerData[1].hasOwnProperty('isFavorite') ? (
          <React.Fragment>
            <Button
              variant="plain"
              aria-label="Favorite"
              onClick={() => onToggleFavorite(data.selectedPlayerData[1], 1)}
            >
              {data.selectedPlayerData[1].isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        )
      ]
    },
    {
      cells: [
        data.selectedPlayerData[0].hasOwnProperty('birthDate')
          ? moment.utc(data.selectedPlayerData[0].birthDate).format('ll')
          : '',
        'Birthdate',
        data.selectedPlayerData[1].hasOwnProperty('birthDate')
          ? moment.utc(data.selectedPlayerData[1].birthDate).format('ll')
          : ''
      ]
    },
    {
      cells: [data.selectedPlayerData[0].position || '', 'Position', data.selectedPlayerData[1].position || '']
    },
    {
      cells: [
        data.selectedPlayerData[0].hasOwnProperty('height')
          ? `${data.selectedPlayerData[0].height.split('-')[0]}' ${data.selectedPlayerData[0].height.split('-')[1]}"`
          : '',
        'Height',
        data.selectedPlayerData[1].hasOwnProperty('height')
          ? `${data.selectedPlayerData[1].height.split('-')[0]}' ${data.selectedPlayerData[1].height.split('-')[1]}"`
          : ''
      ]
    },
    {
      cells: [
        data.selectedPlayerData[0].hasOwnProperty('weight') ? `${data.selectedPlayerData[0].weight} lbs` : '',
        'Weight',
        data.selectedPlayerData[1].hasOwnProperty('weight') ? `${data.selectedPlayerData[1].weight} lbs` : ''
      ]
    }
  ];

  const onToggleFavorite = (player, pos) => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/player/${player.id}`, {
      method: player.isFavorite ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.ok)
          dispatch({
            type: 'FAVORITE_TOGGLED',
            payload: { player, pos }
          });
        else props.showAlert("Ooops, looks like that didn't work 😔");
      })
      .catch(error => {
        props.showAlert("Ooops, looks like that didn't work 😔");
      });
  };

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Players</Text>
          <Text component="p">Choose two players and compare their statistics.</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Stack gutter="md">
          <StackItem>
            <Card>
              <CardBody>
                <Grid gutter="md">
                  <GridItem span={5}>
                    <Bullseye>{dropdown(0)}</Bullseye>
                  </GridItem>
                  <GridItem span={2}>
                    <Bullseye>
                      <Text>vs.</Text>
                    </Bullseye>
                  </GridItem>
                  <GridItem span={5}>
                    <Bullseye>{dropdown(1)}</Bullseye>
                  </GridItem>
                  <GridItem span={5}>
                    <Bullseye>{photo(0)}</Bullseye>
                  </GridItem>
                  <GridItem span={2}></GridItem>
                  <GridItem span={5}>
                    <Bullseye>{photo(1)}</Bullseye>
                  </GridItem>
                  <GridItem span={12}>
                    <Bullseye>
                      <Table aria-label="Player Data" cells={playerDataColumns} rows={playerDataRows}>
                        <TableHeader />
                        <TableBody />
                      </Table>
                    </Bullseye>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card>
              <CardBody>
                <PlaceholderChart />
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default PlayerComparison;
