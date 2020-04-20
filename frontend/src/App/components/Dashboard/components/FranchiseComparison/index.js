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
import PlaceholderChart from '../../charts/PlaceholderChart';

const initialState = {
  franchises: [],
  filteredFranchises: [[], []],
  selectedFranchise: [null, null],
  selectedFranchiseData: [{}, {}],
  searchFranchise: ['', ''],
  dropdownIsOpen: [false, false],
  error: null,
  loading: true
};

const franchiseDataColumns = [
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
        franchises: action.payload.franchises,
        filteredFranchises: [action.payload.franchises, action.payload.franchises]
      };
    case 'FETCH_FRANCHISES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case 'SEARCH_FRANCHISE_INPUT':
      return {
        ...state,
        searchFranchise: Object.assign([...state.searchFranchise], { [action.payload.pos]: action.payload.value })
      };
    case 'TOGGLE_FRANCHISE_DROPDOWN':
      return {
        ...state,
        dropdownIsOpen: Object.assign([...state.dropdownIsOpen], {
          [action.payload.pos]: action.payload.isOpen
        })
      };
    case 'SELECT_FRANCHISE':
      return {
        ...state,
        selectedFranchise: Object.assign([...state.selectedFranchise], { [action.payload.pos]: action.payload.value }),
        selectedFranchiseData: Object.assign([...state.selectedFranchiseData], {
          [action.payload.pos]: state.franchises.find(franchise => franchise.nickname === action.payload.value)
        }),
        dropdownIsOpen: Object.assign([...state.dropdownIsOpen], {
          [action.payload.pos]: !state.dropdownIsOpen[action.payload.pos]
        })
      };
    case 'SEARCH_FRANCHISE':
      return {
        ...state,
        filteredFranchises: Object.assign([...state.filteredFranchises], {
          [action.payload.pos]:
            state.searchFranchise[action.payload.pos] === ''
              ? state.franchises
              : state.franchises.filter(
                  franchise =>
                    franchise.nickname
                      .toLowerCase()
                      .indexOf(state.searchFranchise[action.payload.pos].toLowerCase()) !== -1
                )
        })
      };
    case 'FAVORITE_TOGGLED':
      const franchise = action.payload.franchise;
      franchise.isFavorite = !franchise.isFavorite;
      return {
        ...state,
        franchises: Object.assign([...state.franchises], {
          [state.franchises.findIndex(el => el.id === franchise.id)]: franchise
        }),
        selectedFranchiseData: Object.assign([...state.selectedFranchiseData], {
          [action.payload.pos]: franchise
        })
      };
    default:
      return state;
  }
};
const FranchiseComparison = props => {
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_FRANCHISES_REQUEST'
    });
    fetchFranchises();
  }, []);

  const fetchFranchises = () => {
    fetch(`${BACKEND}/api/franchise?pageSize=200&page=1&order=nickname&orderType=ASC`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises =>
        dispatch({
          type: 'FETCH_FRANCHISES_SUCCESS',
          payload: {
            franchises,
            loading: false
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

  const selectedFranchise = pos => (data.selectedFranchise[pos] ? data.selectedFranchise[pos] : 'Select a Franchise');

  const onSearchInputChange = (pos, value) => {
    dispatch({
      type: 'SEARCH_FRANCHISE_INPUT',
      payload: {
        pos,
        value
      }
    });
  };

  const onDropdownToggle = (pos, isOpen) =>
    dispatch({
      type: 'TOGGLE_FRANCHISE_DROPDOWN',
      payload: {
        pos,
        isOpen
      }
    });

  const onDropdownSelect = (pos, value) => {
    dispatch({
      type: 'SELECT_FRANCHISE',
      payload: {
        pos,
        value
      }
    });
  };

  const onSearchButtonClick = pos =>
    dispatch({
      type: 'SEARCH_FRANCHISE',
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
        toggleText={selectedFranchise(pos)}
        onSearchInputChange={value => onSearchInputChange(pos, value)}
        isOpen={data.dropdownIsOpen[pos]}
        searchInputValue={data.searchFranchise[pos]}
        onToggle={(_, isOpen) => onDropdownToggle(pos, isOpen)}
        onSelect={(_, value) => onDropdownSelect(pos, value)}
        onSearchButtonClick={() => onSearchButtonClick(pos)}
        screenReaderLabel="Selected Franchise:"
      >
        {data.filteredFranchises[pos].map(franchise => (
          <ContextSelectorItem key={franchise.id}>{franchise.nickname}</ContextSelectorItem>
        ))}
      </ContextSelector>
    );

  const franchiseDataRows = [
    {
      cells: [
        data.selectedFranchiseData[0].hasOwnProperty('isFavorite') ? (
          <React.Fragment>
            <Button
              variant="plain"
              aria-label="Favorite"
              onClick={() => onToggleFavorite(data.selectedFranchiseData[0], 0)}
            >
              {data.selectedFranchiseData[0].isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        ),
        'Favorite',
        data.selectedFranchiseData[1].hasOwnProperty('isFavorite') ? (
          <React.Fragment>
            <Button
              variant="plain"
              aria-label="Favorite"
              onClick={() => onToggleFavorite(data.selectedFranchiseData[1], 1)}
            >
              {data.selectedFranchiseData[1].isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        )
      ]
    },
    {
      cells: [
        data.selectedFranchiseData[0].abbreviation || '',
        'Abbreviation',
        data.selectedFranchiseData[1].abbreviation || ''
      ]
    },
    {
      cells: [
        data.selectedFranchiseData[0].yearFounded || '',
        'Year Founded',
        data.selectedFranchiseData[1].yearFounded || ''
      ]
    },
    {
      cells: [data.selectedFranchiseData[0].city || '', 'City', data.selectedFranchiseData[1].city || '']
    },
    {
      cells: [data.selectedFranchiseData[0].arena || '', 'Arena', data.selectedFranchiseData[1].arena || '']
    }
  ];

  const onToggleFavorite = (franchise, pos) => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/franchise/${franchise.id}`, {
      method: franchise.isFavorite ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.ok)
          dispatch({
            type: 'FAVORITE_TOGGLED',
            payload: { franchise, pos }
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
          <Text component="h1">Franchises</Text>
          <Text component="p">Choose two franchises and compare their statistics.</Text>
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
                  <GridItem span={12}>
                    <Bullseye>
                      <Table aria-label="Franchise Data" cells={franchiseDataColumns} rows={franchiseDataRows}>
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

export default FranchiseComparison;
