import React from 'react';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  DataList,
  DataListAction,
  DataListCell,
  DataListCheck,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  InputGroup,
  InputGroupText,
  KebabToggle,
  PageSection,
  PageSectionVariants,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import _ from 'lodash';
import nlp from 'compromise';
import { useDebounce } from 'use-debounce';
import { AuthContext } from '../../../../Auth';

const initialState = {
  searchInput: '',
  loading: false,
  searchResult: {
    players: [],
    franchises: []
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_START':
      return {
        ...state,
        loading: true
      };
    case 'SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.payload.value
      };
    case 'SEARCH_RESULT':
      return {
        ...state,
        loading: false,
        searchResult: {
          players:
            _.isEmpty(action.payload.players) || _.isEmpty(action.payload.players[0])
              ? state.searchResult.players
              : action.payload.players,
          franchises:
            _.isEmpty(action.payload.franchises) || _.isEmpty(action.payload.franchises[0])
              ? state.searchResult.franchises
              : action.payload.franchises
        }
      };
    default:
      return state;
  }
};

const Search = props => {
  const [data, dispatch] = React.useReducer(reducer, initialState);
  const { state: authState } = React.useContext(AuthContext);
  const [searchValue] = useDebounce(data.searchInput, 1000);

  React.useEffect(() => {
    dispatch({ type: 'SEARCH_START' });
    const detectedTeams = nlp(searchValue)
      .match('#SportsTeam+')
      .out('array');
    const detectedNames = nlp(searchValue)
      .match('#Person+')
      .out('array');
    const detectedNouns = nlp(searchValue)
      .normalize()
      .match('#Noun')
      .out('array');

    Promise.all([searchPlayers(detectedNames), searchFranchises(detectedTeams)]).then(([players, franchises]) => {
      dispatch({
        type: 'SEARCH_RESULT',
        payload: {
          players,
          franchises
        }
      });
    });
  }, [searchValue]);

  const playerAnalysisResult = player => (
    <DataListItem aria-labelledby={`player-${player.id}-item`} id={`player-${player.id}`}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`player-${player.id}-primary-content`}>
              <span id={`player-${player.id}-item`}>Player Analysis: {player.name}</span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const franchiseAnalysisResult = franchise => (
    <DataListItem aria-labelledby={`franchise-${franchise.id}-item`} id={`franchise-${franchise.id}`}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`franchise-${franchise.id}-primary-content`}>
              <span id={`franchise-${franchise.id}-item`}>
                Franchise Analysis: {franchise.city} {franchise.nickname}
              </span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const playerComparisonResult = (player1, player2) => (
    <DataListItem
      aria-labelledby={`player-${player1.id}-vs-player-${player2.id}-item`}
      id={`player-${player1.id}-vs-player-${player2.id}`}
    >
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`player-${player1.id}-vs-player-${player2.id}-primary-content`}>
              <span id={`player-${player1.id}-vs-player-${player2.id}-item`}>
                Comparison: {player1.name} vs. {player2.name}
              </span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const franchiseComparisonResult = (franchise1, franchise2) => (
    <DataListItem
      aria-labelledby={`franchise-${franchise1.id}-vs-franchise-${franchise2.id}-item`}
      id={`franchise-${franchise1.id}-vs-franchise-${franchise2.id}`}
    >
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`franchise-${franchise1.id}-vs-franchise-${franchise2.id}-primary-content`}>
              <span id={`franchise-${franchise1.id}-vs-franchise-${franchise2.id}-item`}>
                Franchise Comparison: {franchise1.city} {franchise1.nickname} vs. {franchise2.city}{' '}
                {franchise2.nickname}
              </span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const playersResult = () => {
    const results = [];
    if (_.size(data.searchResult.players) === 2) {
      _.forEach(data.searchResult.players[0], player1 =>
        _.forEach(data.searchResult.players[1], player2 => results.push(playerComparisonResult(player1, player2)))
      );
    }
    if (_.size(data.searchResult.players) >= 1) {
      _.forEach(data.searchResult.players, playerResults =>
        results.push(..._.map(playerResults, player => playerAnalysisResult(player)))
      );
    }
    return results;
  };

  const franchisesResult = () => {
    const results = [];
    if (_.size(data.searchResult.franchises) === 2) {
      _.forEach(data.searchResult.franchises[0], franchise1 =>
        _.forEach(data.searchResult.franchises[1], franchise2 =>
          results.push(franchiseComparisonResult(franchise1, franchise2))
        )
      );
    }
    if (_.size(data.searchResult.franchises) >= 1) {
      _.forEach(data.searchResult.franchises, franchiseResults =>
        results.push(..._.map(franchiseResults, franchise => franchiseAnalysisResult(franchise)))
      );
    }
    return results;
  };

  const searchResults = _.concat(playersResult(), franchisesResult());

  const searchPlayers = names => {
    return Promise.all(
      _.map(names, name =>
        fetch(`${BACKEND}/api/player?pageSize=10&page=1&order=name&orderType=ASC&search=${name}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        })
      )
    )
      .then(responses => {
        return _.map(responses, response => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        });
      })
      .then(players => Promise.all(players))
      .catch(error => {
        props.onError('Could not search players 😔');
      });
  };

  const searchFranchises = names => {
    return Promise.all(
      _.map(names, name =>
        fetch(`${BACKEND}/api/franchise?pageSize=10&page=1&order=city,nickname&orderType=ASC&search=${name}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        })
      )
    )
      .then(responses => {
        return _.map(responses, response => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        });
      })
      .then(franchise => Promise.all(franchise))
      .catch(error => {
        props.onError('Could not search franchises 😔');
      });
  };

  const onChange = value => {
    dispatch({
      type: 'SEARCH_INPUT',
      payload: {
        value
      }
    });
  };

  const noResults = (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon icon={SearchIcon} />
        <Title size="lg">No results found</Title>
      </EmptyState>
    </Bullseye>
  );

  const loading = (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon variant="container" component={Spinner} />
        <Title size="lg">Loading</Title>
      </EmptyState>
    </Bullseye>
  );

  const onSelectSearchResult = () => {};

  const results = (
    <DataList
      aria-label="search results"
      selectedDataListItemId={data.selectedSearchResult}
      onSelectDataListItem={onSelectSearchResult}
    >
      {searchResults}
    </DataList>
  );

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>Overview: Search</Text>
          <Text component={TextVariants.p}>Use natural language to find interesting NBA insights!</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Stack gutter="md">
          <StackItem>
            <Card>
              <CardBody>
                <InputGroup>
                  <TextInput name="search" id="search" type="search" aria-label="search" onChange={onChange} />
                  <Button variant="control">
                    <SearchIcon />
                  </Button>
                </InputGroup>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem isFilled>
            <Card>
              <CardBody style={{ padding: 0 }}>
                {data.loading
                  ? loading
                  : _.isEmpty(data.searchResult.players) && _.isEmpty(data.searchResult.franchises)
                  ? noResults
                  : results}
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default Search;
