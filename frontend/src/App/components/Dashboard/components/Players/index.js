import React from 'react';
import {
  Bullseye,
  Button,
  DataToolbar,
  DataToolbarContent,
  DataToolbarGroup,
  DataToolbarItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  FlexModifiers,
  PageSection,
  PageSectionVariants,
  Pagination,
  Select,
  SelectOption,
  SelectVariant,
  Text,
  TextContent,
  Title
} from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  SortAlphaDownIcon,
  SortAlphaUpIcon,
  StarIcon,
  OutlinedStarIcon,
  SearchIcon
} from '@patternfly/react-icons';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Spinner } from '@patternfly/react-core';
import moment from 'moment';
import { AuthContext } from '../../../../Auth';
import PlayerDetails from '../PlayerDetails';

const initialState = {
  players: [],
  perPage: 0,
  total: 0,
  page: 0,
  error: null,
  loading: true,
  sortIsExpanded: false,
  sortSelected: 'Player ID',
  sortOrder: 'ASC',
  detailModalOpen: false,
  selectedPlayer: null
};
const cells = ['Favorite', 'Player ID', 'Name', 'Birthdate', 'Position', 'Height', 'Weight'];

const mapping = {
  'Player ID': 'id',
  Name: 'name',
  Birthdate: 'birthDate',
  Position: 'position',
  Height: 'height',
  Weight: 'weight',
  Favorite: 'isFavorite'
};

const filterOptions = [
  {
    value: 'Sort By',
    disabled: false,
    isPlaceholder: true
  },
  ...cells.map(cell => ({
    value: cell,
    disabled: false
  }))
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
        total: action.payload.total,
        players: action.payload.players,
        perPage: action.payload.perPage,
        page: action.payload.page
      };
    case 'FETCH_PLAYERS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        perPage: 0,
        page: 0,
        total: 0
      };
    case 'SORT_PLAYERS_TOGGLE':
      return {
        ...state,
        sortIsExpanded: action.payload.isExpanded
      };
    case 'SORT_PLAYERS_SELECT':
      return {
        ...state,
        sortSelected: action.payload.selection,
        sortIsExpanded: false
      };
    case 'SORT_PLAYERS_ORDER_TOGGLE':
      return {
        ...state,
        sortOrder: action.payload.sortOrder
      };
    case 'FAVORITE_CREATED':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.playerId ? { ...player, isFavorite: true } : player
        ),
        selectedPlayer:
          state.selectedPlayer && state.selectedPlayer.id === action.payload.playerId
            ? {
                ...state.selectedPlayer,
                isFavorite: true
              }
            : state.selectedPlayer
      };
    case 'FAVORITE_DELETED':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.playerId ? { ...player, isFavorite: false } : player
        ),
        selectedPlayer:
          state.selectedPlayer && state.selectedPlayer.id === action.payload.playerId
            ? {
                ...state.selectedPlayer,
                isFavorite: false
              }
            : state.selectedPlayer
      };
    case 'DETAIL_MODAL_TOGGLE':
      return {
        ...state,
        detailModalOpen: !state.detailModalOpen,
        selectedPlayer: action.payload.player
      };
    default:
      return state;
  }
};
const Players = props => {
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_PLAYERS_REQUEST'
    });
    fetchData(data.page || 1, data.perPage || 20, mapping[data.sortSelected] || 'id', data.sortOrder || 'ASC');
  }, []);

  const fetchData = (page, perPage, order, orderType) => {
    Promise.all([
      fetch(
        `${BACKEND}/api/player?pageSize=${perPage}&page=${page}&order=${
          order ? order.toLowerCase() : 'id'
        }&orderType=${orderType}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      ),
      fetch(`${BACKEND}/api/player/count`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      })
    ])
      .then(([players, total]) => Promise.all([players.json(), total.json()]))
      .then(([playersJson, totalJson]) =>
        dispatch({
          type: 'FETCH_PLAYERS_SUCCESS',
          payload: {
            players: playersJson,
            total: totalJson,
            loading: false,
            perPage,
            page
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

  const renderPagination = (variant = 'top') => {
    return (
      <Pagination
        itemCount={data.total}
        page={data.page}
        perPage={data.perPage}
        onSetPage={(_evt, value) => fetchData(value, data.perPage, mapping[data.sortSelected], data.sortOrder)}
        onPerPageSelect={(_evt, value) => fetchData(1, value, mapping[data.sortSelected], data.sortOrder)}
        variant={variant}
      />
    );
  };

  const onSortToggle = isExpanded =>
    dispatch({
      type: 'SORT_PLAYERS_TOGGLE',
      payload: {
        isExpanded
      }
    });

  const onSortSelect = (event, selection) => {
    if (selection === 'Sort By') selection = data.sortSelected;
    dispatch({
      type: 'SORT_PLAYERS_SELECT',
      payload: {
        isExpanded: false,
        selection: selection
      }
    });
    fetchData(1, data.perPage, mapping[selection], data.sortOrder);
  };

  const onSortOrderToggle = () => {
    let sortOrder;
    if (data.sortOrder === 'ASC') {
      sortOrder = 'DESC';
    } else {
      sortOrder = 'ASC';
    }
    dispatch({
      type: 'SORT_PLAYERS_ORDER_TOGGLE',
      payload: {
        sortOrder
      }
    });
    fetchData(1, data.perPage, mapping[data.sortSelected], sortOrder);
  };

  const onToggleFavorite = player => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/player/${player.id}`, {
      method: player.isFavorite ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.ok)
          player.isFavorite
            ? dispatch({
                type: 'FAVORITE_DELETED',
                payload: { playerId: player.id }
              })
            : dispatch({
                type: 'FAVORITE_CREATED',
                payload: { playerId: player.id }
              });
        else props.showAlert("Ooops, looks like that didn't work 😔");
      })
      .catch(error => {
        props.showAlert("Ooops, looks like that didn't work 😔");
      });
  };

  const onToggleDetailModal = player => {
    dispatch({
      type: 'DETAIL_MODAL_TOGGLE',
      payload: { player }
    });
  };

  if (data.error) {
    const noResultsRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 8 },
            title: (
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={ExclamationCircleIcon} color={globalDangerColor200.value} />
                  <Title headingLevel="h2" size="lg">
                    Unable to connect
                  </Title>
                  <EmptyStateBody>
                    There was an error retrieving data. Check your connection and try again.
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            )
          }
        ]
      }
    ];

    return (
      <React.Fragment>
        <Table cells={cells} rows={noResultsRows} aria-label="Pagination Table Demo">
          <TableHeader />
          <TableBody />
        </Table>
      </React.Fragment>
    );
  }

  const loadingRows = [
    {
      heightAuto: true,
      cells: [
        {
          id: 1,
          props: { colSpan: 8 },
          title: (
            <Bullseye>
              <center>
                <Spinner size="xl" />
              </center>
            </Bullseye>
          )
        }
      ]
    }
  ];

  return (
    <React.Fragment>
      <PlayerDetails
        player={data.selectedPlayer}
        isOpen={data.detailModalOpen}
        showAlert={props.showAlert}
        toggle={onToggleDetailModal}
        toggleFavorite={onToggleFavorite}
      />
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Players</Text>
          <Text component="p">Overview over all players currently in the DB</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <DataToolbar id="players-data-toolbar" className="pf-u-justify-content-space-between">
          <DataToolbarContent>
            <DataToolbarGroup variant="players-sort-group">
              <DataToolbarItem>
                <Select
                  variant={SelectVariant.single}
                  aria-label="Sort By"
                  onToggle={onSortToggle}
                  onSelect={onSortSelect}
                  selections={data.sortSelected}
                  isExpanded={data.sortIsExpanded}
                >
                  {filterOptions.map((option, index) => (
                    <SelectOption isDisabled={option.disabled} key={index} value={option.value} />
                  ))}
                </Select>
              </DataToolbarItem>
              <DataToolbarItem>
                <Button variant="plain" aria-label="Sort A-Z" onClick={onSortOrderToggle}>
                  {data.sortOrder === 'ASC' ? <SortAlphaDownIcon /> : <SortAlphaUpIcon />}
                </Button>
              </DataToolbarItem>
            </DataToolbarGroup>
            <DataToolbarItem breakpointMods={[{ modifier: FlexModifiers['align-right'] }]}>
              {renderPagination()}
            </DataToolbarItem>
          </DataToolbarContent>
        </DataToolbar>

        {!data.loading && (
          <Table
            cells={[...cells, 'Details']}
            rows={data.players.map(player => [
              <React.Fragment>
                <Button variant="plain" aria-label="Favorite" onClick={() => onToggleFavorite(player)}>
                  {player.isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
                </Button>
              </React.Fragment>,
              player.id,
              player.name,
              moment(player.birthDate).format('ll'),
              player.position,
              `${player.height.split('-')[0]}' ${player.height.split('-')[1]}"`,
              `${player.weight} lbs`,
              <React.Fragment>
                <Button variant="plain" aria-label="Details" onClick={() => onToggleDetailModal(player)}>
                  <SearchIcon />
                </Button>
              </React.Fragment>
            ])}
            aria-label="Players Overview Table"
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {data.loading && (
          <Table cells={cells} rows={loadingRows} aria-label="Players Overview Table">
            <TableHeader />
            <TableBody />
          </Table>
        )}
      </PageSection>
    </React.Fragment>
  );
};

export default Players;
