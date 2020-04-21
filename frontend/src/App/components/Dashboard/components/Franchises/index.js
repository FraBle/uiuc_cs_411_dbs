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
import { AuthContext } from '../../../../Auth';
import FranchiseDetails from '../FranchiseDetails';

const initialState = {
  franchises: [],
  perPage: 0,
  total: 0,
  page: 0,
  error: null,
  loading: true,
  sortIsExpanded: false,
  sortSelected: 'Franchise ID',
  sortOrder: 'ASC',
  detailModalOpen: false,
  selectedFranchise: null
};
const cells = ['Favorite', 'Franchise ID', 'Abbreviation', 'Nickname', 'Year Founded', 'City', 'Arena'];

const mapping = {
  'Franchise ID': 'id',
  Favorite: 'isFavorite',
  Abbreviation: 'abbreviation',
  Nickname: 'nickname',
  'Year Founded': 'yearFounded',
  City: 'City',
  Arena: 'Arena'
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
    case 'FETCH_FRANCHISES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_FRANCHISES_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        total: action.payload.total,
        franchises: action.payload.franchises,
        perPage: action.payload.perPage,
        page: action.payload.page
      };
    case 'FETCH_FRANCHISES_FAILURE':
      return {
        ...state,
        error: action.payload.error,
        loading: false,
        perPage: 0,
        page: 0,
        total: 0
      };
    case 'SORT_FRANCHISES_TOGGLE':
      return {
        ...state,
        sortIsExpanded: action.payload.isExpanded
      };
    case 'SORT_FRANCHISES_SELECT':
      return {
        ...state,
        sortSelected: action.payload.selection,
        sortIsExpanded: false
      };
    case 'SORT_FRANCHISES_ORDER_TOGGLE':
      return {
        ...state,
        sortOrder: action.payload.sortOrder
      };
    case 'FAVORITE_CREATED':
      return {
        ...state,
        franchises: state.franchises.map(franchise =>
          franchise.id === action.payload.franchiseId ? { ...franchise, isFavorite: true } : franchise
        ),
        selectedFranchise:
          state.selectedFranchise && state.selectedFranchise.id === action.payload.franchiseId
            ? {
                ...state.selectedFranchise,
                isFavorite: true
              }
            : state.selectedFranchise
      };
    case 'FAVORITE_DELETED':
      return {
        ...state,
        franchises: state.franchises.map(franchise =>
          franchise.id === action.payload.franchiseId ? { ...franchise, isFavorite: false } : franchise
        ),
        selectedFranchise:
          state.selectedFranchise && state.selectedFranchise.id === action.payload.franchiseId
            ? {
                ...state.selectedFranchise,
                isFavorite: false
              }
            : state.selectedFranchise
      };
    case 'DETAIL_MODAL_TOGGLE':
      return {
        ...state,
        detailModalOpen: !state.detailModalOpen,
        selectedFranchise: action.payload.franchise
      };
    default:
      return state;
  }
};
const Franchises = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_FRANCHISES_REQUEST'
    });
    fetchData(data.page || 1, data.perPage || 20, mapping[data.sortSelected] || 'id', data.sortOrder || 'ASC');
  }, []);

  const fetchData = (page, perPage, order, orderType) => {
    Promise.all([
      fetch(
        `${BACKEND}/api/franchise?pageSize=${perPage}&page=${page}&order=${
          order ? order.toLowerCase() : 'id'
        }&orderType=${orderType}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      ),
      fetch(`${BACKEND}/api/franchise/count`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      })
    ])
      .then(([franchises, total]) => Promise.all([franchises.json(), total.json()]))
      .then(([franchisesJson, totalJson]) =>
        dispatch({
          type: 'FETCH_FRANCHISES_SUCCESS',
          payload: {
            franchises: franchisesJson,
            total: totalJson,
            loading: false,
            perPage,
            page
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_FRANCHISES_FAILURE',
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
      type: 'SORT_FRANCHISES_TOGGLE',
      payload: {
        isExpanded
      }
    });

  const onSortSelect = (event, selection) => {
    if (selection === 'Sort By') selection = data.sortSelected;
    dispatch({
      type: 'SORT_FRANCHISES_SELECT',
      payload: {
        isExpanded: false,
        selection
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
      type: 'SORT_FRANCHISES_ORDER_TOGGLE',
      payload: {
        sortOrder
      }
    });
    fetchData(1, data.perPage, mapping[data.sortSelected], sortOrder);
  };

  const onToggleFavorite = (franchiseId, isFavorite) => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/franchise/${franchiseId}`, {
      method: isFavorite ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.ok)
          isFavorite
            ? dispatch({
                type: 'FAVORITE_DELETED',
                payload: { franchiseId }
              })
            : dispatch({
                type: 'FAVORITE_CREATED',
                payload: { franchiseId }
              });
        else props.showAlert("Ooops, looks like that didn't work 😔");
      })
      .catch(error => {
        props.showAlert("Ooops, looks like that didn't work 😔");
      });
  };

  const onToggleDetailModal = franchise => {
    dispatch({
      type: 'DETAIL_MODAL_TOGGLE',
      payload: { franchise }
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
      <FranchiseDetails
        franchise={data.selectedFranchise}
        isOpen={data.detailModalOpen}
        showAlert={props.showAlert}
        toggle={onToggleDetailModal}
        toggleFavorite={onToggleFavorite}
      />
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Franchises</Text>
          <Text component="p">Overview over all franchises currently in the DB</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <DataToolbar id="franchises-data-toolbar" className="pf-u-justify-content-space-between">
          <DataToolbarContent>
            <DataToolbarGroup variant="franchises-sort-group">
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
            rows={data.franchises.map(franchise => [
              <React.Fragment>
                <Button
                  variant="plain"
                  aria-label="Favorite"
                  onClick={() => onToggleFavorite(franchise.id, franchise.isFavorite)}
                >
                  {franchise.isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
                </Button>
              </React.Fragment>,
              franchise.id,
              franchise.abbreviation,
              franchise.nickname,
              franchise.yearFounded,
              franchise.city,
              franchise.arena,
              <React.Fragment>
                <Button variant="plain" aria-label="Details" onClick={() => onToggleDetailModal(franchise)}>
                  <SearchIcon />
                </Button>
              </React.Fragment>
            ])}
            aria-label="Franchises Overview Table"
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {data.loading && (
          <Table cells={cells} rows={loadingRows} aria-label="Franchises Overview Table">
            <TableHeader />
            <TableBody />
          </Table>
        )}
      </PageSection>
    </React.Fragment>
  );
};

export default Franchises;
