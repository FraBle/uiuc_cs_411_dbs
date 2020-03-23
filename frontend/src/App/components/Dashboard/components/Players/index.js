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
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon, SortAlphaDownIcon, SortAlphaUpIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Spinner } from '@patternfly/react-core';
import moment from 'moment';

const initialState = {
  players: [],
  perPage: 0,
  total: 0,
  page: 0,
  error: null,
  loading: true,
  sortIsExpanded: false,
  sortSelected: null,
  sortOrder: 'ASC',
};
const cells = ['ID', 'Name', 'Birthdate', 'Position', 'Height', 'Weight'];
const filterOptions = [
  {
    value: 'Sort By',
    disabled: false,
    isPlaceholder: true,
  },
  ...cells.map(cell => ({
    value: cell,
    disabled: false,
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
        loading: false,
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
    default:
      return state;
  }
};
const Players = () => {

  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_PLAYERS_REQUEST'
    });
    fetchData(
      data.page || 1,
      data.perPage || 20,
      data.sortSelected || 'id',
      data.sortOrder || 'ASC'
    );
  }, []);

  const fetchData = (page, perPage, order, orderType) => {
    Promise.all([
      fetch(
        `${BACKEND}/api/player?pageSize=${perPage}&page=${page}&order=${
          order ? order.toLowerCase() : 'id'
        }&orderType=${orderType}`
      ),
      fetch(`${BACKEND}/api/player/count`)
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
        onSetPage={(_evt, value) => fetchData(value, data.perPage, data.sortSelected, data.sortOrder)}
        onPerPageSelect={(_evt, value) => fetchData(1, value, data.sortSelected, data.sortOrder)}
        variant={variant}
      />
    );
  }

  const onSortToggle = isExpanded => dispatch({
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
        selection
      }
    });
    fetchData(1, data.perPage, selection, data.sortOrder);
  }

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
    fetchData(1, data.perPage, data.sortSelected, sortOrder);
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

  const loadingRows = [{
    heightAuto: true,
    cells: [
      {
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
  }];

  return (
    <React.Fragment>
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
            cells={cells}
            rows={data.players.map(player => [
              player.id,
              player.name,
              moment(player.birthDate).format('ll'),
              player.position,
              `${player.height.split('-')[0]}' ${player.height.split('-')[1]}"`,
              `${player.weight} lbs`
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
}

export default Players;
