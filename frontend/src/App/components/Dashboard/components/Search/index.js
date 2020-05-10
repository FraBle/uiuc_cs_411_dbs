import React from 'react';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  EmptyState,
  EmptyStateIcon,
  InputGroup,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  SimpleList,
  Title,
  Chip,
  ChipGroup
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { useDebounce } from 'use-debounce';
import Autosuggest from 'react-autosuggest';
import { AuthContext } from '../../../../Auth';

const initialState = {
  searchInput: '',
  suggestionInput: '',
  suggestions: [],
  tables: {},
  filters: []
};

const categoryToLabel = {
  player: 'Player',
  franchise: 'Franchise',
  playerstats: 'Player Stats',
  franchisestats: 'Franchise Stats',
  gamestats: 'Game Stats'
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.payload.value
      };
    case 'ADD_FILTER':
      return {
        ...state,
        filters: _.concat(state.filters, action.payload.filter),
        searchInput: ''
      };
    case 'DELETE_FILTER':
      return {
        ...state,
        filters: _.filter(
          state.filters,
          filter => filter.name !== action.payload.filter.name && filter.category !== action.payload.filter.category
        )
      };
    case 'SUGGESTIONS_FETCH_REQUEST':
      return {
        ...state,
        suggestionInput: action.payload.value
      };
    case 'SUGGESTIONS_FETCH_SUCCESS':
      return {
        ...state,
        suggestions: action.payload.suggestions
      };
    case 'TABLE_COLUMNS_FETCH_SUCCESS':
      return {
        ...state,
        tables: action.payload.tables
      };
    case 'SUGGESTIONS_CLEAR_REQUEST':
      return {
        ...state,
        suggestions: []
      };
    default:
      return state;
  }
};

const Search = props => {
  const [data, dispatch] = React.useReducer(reducer, initialState);
  const { state: authState } = React.useContext(AuthContext);
  const history = useHistory();
  const [searchValue] = useDebounce(data.suggestionInput, 500);

  React.useEffect(() => {
    const escapedValue = escapeRegexCharacters(searchValue.trim());

    if (escapedValue === '') {
      return dispatch({ type: 'SUGGESTIONS_CLEAR_REQUEST' });
    }

    Promise.all([searchPlayers(escapedValue), searchFranchises(escapedValue)]).then(([players, franchises]) => {
      dispatch({
        type: 'SUGGESTIONS_FETCH_SUCCESS',
        payload: {
          suggestions: toSuggestion(escapedValue, players, franchises)
        }
      });
    });
  }, [searchValue]);

  React.useEffect(() => {
    fetchTableColumns();
  }, []);

  const fetchTableColumns = value => {
    return fetch(`${BACKEND}/api/table/column`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(tables =>
        dispatch({
          type: 'TABLE_COLUMNS_FETCH_SUCCESS',
          payload: {
            tables: tables
          }
        })
      )
      .catch(error => {
        props.onError('Could not load database metadata 😔');
      });
  };

  const searchPlayers = value => {
    return fetch(`${BACKEND}/api/player?pageSize=10&page=1&order=name&orderType=ASC&search=${value}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(players => players)
      .catch(error => {
        props.onError('Could not search players 😔');
      });
  };

  const searchFranchises = value => {
    return fetch(`${BACKEND}/api/franchise?pageSize=10&page=1&order=city,nickname&orderType=ASC&search=${value}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises => franchises)
      .catch(error => {
        props.onError('Could not search franchises 😔');
      });
  };

  const toSuggestion = (escapedValue, players, franchises) =>
    _.concat(
      [
        {
          title: 'Players',
          results: _.map(players, player => ({
            name: player.name,
            category: 'player',
            id: player.id,
            url: `/dashboard/analysis/player?id=${player.id}&tab=Overall`
          }))
        },
        {
          title: 'Franchises',
          results: _.map(franchises, franchise => ({
            name: `${franchise.city} ${franchise.nickname}`,
            category: 'franchise',
            id: franchise.id,
            url: `/dashboard/analysis/franchise?id=${franchise.id}&tab=Overall`
          }))
        }
      ],
      filterColumns(escapedValue)
    );

  const filterColumns = escapedValue => {
    const searchValue = _.toLower(_.join(_.split(escapedValue, ' '), ''));
    return [
      {
        title: 'Player Stats',
        results: _.map(
          _.filter(
            _.uniq(
              _.map(
                _.concat(
                  _.get(data.tables, 'Player', []),
                  _.get(data.tables, 'PlayerAllStats', []),
                  _.get(data.tables, 'PlayerGameStats', []),
                  _.get(data.tables, 'PlayerSeasonStats', [])
                ),
                _.toLower
              )
            ),
            column => _.includes(_.toLower(_.join(_.split(column, ' '), '')), searchValue)
          ),
          column => ({
            name: column,
            category: 'playerstats'
          })
        )
      },
      {
        title: 'Franchise Stats',
        results: _.map(
          _.filter(
            _.uniq(
              _.map(
                _.concat(
                  _.get(data.tables, 'Franchise', []),
                  _.get(data.tables, 'FranchiseAllStats', []),
                  _.get(data.tables, 'FranchiseGameStats', []),
                  _.get(data.tables, 'FranchiseSeasonStats', []),
                  _.get(data.tables, 'FranchiseWinsBySeason', []),
                  _.get(data.tables, 'FranchiseWins', [])
                ),
                _.toLower
              )
            ),
            column => _.includes(_.toLower(_.join(_.split(column, ' '), '')), searchValue)
          ),
          column => ({
            name: column,
            category: 'franchisestats'
          })
        )
      },
      {
        title: 'Game Stats',
        results: _.map(
          _.filter(
            _.uniq(
              _.map(
                _.concat(
                  _.get(data.tables, 'FranchiseGameStats', []),
                  _.get(data.tables, 'PlayerGameStats', []),
                  _.get(data.tables, 'Games', [])
                ),
                _.toLower
              )
            ),
            column => _.includes(_.toLower(_.join(_.split(column, ' '), '')), searchValue)
          ),
          column => ({
            name: column,
            category: 'gamestats'
          })
        )
      }
    ];
  };

  const onChange = (event, { newValue }) => {
    dispatch({
      type: 'SEARCH_INPUT',
      payload: {
        value: newValue
      }
    });
  };

  const inputProps = {
    placeholder: 'Search for players, franchises, stats...',
    value: data.searchInput,
    onChange
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    dispatch({
      type: 'SUGGESTIONS_FETCH_REQUEST',
      payload: { value }
    });
  };

  const onSuggestionsClearRequested = () => {
    dispatch({ type: 'SUGGESTIONS_CLEAR_REQUEST' });
  };

  const onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    dispatch({
      type: 'ADD_FILTER',
      payload: { filter: suggestion }
    });
  };

  const onDeleteFilter = filter => {
    dispatch({
      type: 'DELETE_FILTER',
      payload: { filter }
    });
  };

  const escapeRegexCharacters = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const getSuggestionValue = suggestion => {
    return suggestion.name;
  };

  const renderSuggestion = suggestion => {
    return (
      <button className="pf-c-simple-list__item-link" type="button">
        {suggestion.name}
      </button>
    );
  };

  const renderSectionTitle = section => {
    return _.isEmpty(section.results) ? (
      <React.Fragment></React.Fragment>
    ) : (
      <h2 id={section.title} className="pf-c-simple-list__title" aria-hidden="true">
        {section.title}
      </h2>
    );
  };

  const getSectionSuggestions = section => {
    return section.results;
  };

  const renderSuggestionsContainer = ({ containerProps, children, query }) => (
    <div {...containerProps}>
      <SimpleList aria-label="Suggestions">{children}</SimpleList>
    </div>
  );

  const inputComponent = inputProps => (
    <InputGroup>
      <input
        name="search"
        id="search"
        type="search"
        aria-label="search"
        className="pf-c-form-control"
        {...inputProps}
      />
      <Button variant="control">
        <SearchIcon />
      </Button>
    </InputGroup>
  );

  const noResults = (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon icon={SearchIcon} />
        <Title size="lg">No results found</Title>
      </EmptyState>
    </Bullseye>
  );

  const playerAnalysisResult = (playerId, playerName, url, statsFilters) => (
    <DataListItem
      aria-labelledby={`player-${playerId}-item`}
      id={`dli-player-${playerId}`}
      key={`dli-player-${playerId}`}
      onClick={e => history.push(url)}
    >
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`player-${playerId}-primary-content`}>
              <span id={`player-${playerId}-item`}>
                {`Player Analysis: ${playerName} ${
                  !_.isEmpty(statsFilters)
                    ? `(${_.join(
                        _.map(statsFilters, f => f.name),
                        ', '
                      )})`
                    : ''
                }`}
              </span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const franchiseAnalysisResult = (franchiseId, franchiseName, url, statsFilters) => (
    <DataListItem
      aria-labelledby={`franchise-${franchiseId}-item`}
      id={`dli-franchise-${franchiseId}`}
      key={`dli-franchise-${franchiseId}`}
      onClick={e => history.push(url)}
    >
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`franchise-${franchiseId}-primary-content`}>
              <span id={`franchise-${franchiseId}-item`}>
                {`Franchise Analysis: ${franchiseName} ${
                  !_.isEmpty(statsFilters)
                    ? `(${_.join(
                        _.map(statsFilters, f => f.name),
                        ', '
                      )})`
                    : ''
                }`}
              </span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const playerComparisonResult = (playerId1, playerName1, playerId2, playerName2, url, statsFilters) => (
    <DataListItem
      aria-labelledby={`player-${playerId1}-vs-player-${playerId2}-item`}
      id={`player-${playerId1}-vs-player-${playerId2}`}
      key={`player-${playerId1}-vs-player-${playerId2}`}
      onClick={e => history.push(url)}
    >
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`player-${playerId1}-vs-player-${playerId2}-primary-content`}>
              <span id={`player-${playerId1}-vs-player-${playerId2}-item`}>
                {`Player Comparison: ${playerName1} vs. ${playerName2} ${
                  !_.isEmpty(statsFilters)
                    ? `(${_.join(
                        _.map(statsFilters, f => f.name),
                        ', '
                      )})`
                    : ''
                }`}
              </span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const franchiseComparisonResult = (franchiseId1, franchiseName1, franchiseId2, franchiseName2, url, statsFilters) => (
    <DataListItem
      aria-labelledby={`franchise-${franchiseId1}-vs-franchise-${franchiseId2}-item`}
      id={`franchise-${franchiseId1}-vs-franchise-${franchiseId2}`}
      key={`franchise-${franchiseId1}-vs-franchise-${franchiseId2}`}
      onClick={e => history.push(url)}
    >
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`franchise-${franchiseId1}-vs-franchise-${franchiseId2}-primary-content`}>
              <span id={`franchise-${franchiseId1}-vs-franchise-${franchiseId2}-item`}>
                {`Franchise Comparison: ${franchiseName1} vs. ${franchiseName2} ${
                  !_.isEmpty(statsFilters)
                    ? `(${_.join(
                        _.map(statsFilters, f => f.name),
                        ', '
                      )})`
                    : ''
                }`}
              </span>
            </DataListCell>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );

  const searchResults = () => {
    const playerStatsFilters = _.filter(data.filters, filter => filter.category === 'playerstats');
    const franchiseStatsFilters = _.filter(data.filters, filter => filter.category === 'franchisestats');
    const playerFilters = _.filter(data.filters, filter => filter.category === 'player');
    const franchiseFilters = _.filter(data.filters, filter => filter.category === 'franchise');

    return _.concat(
      _.map(playerFilters, playerFilter =>
        playerAnalysisResult(playerFilter.id, playerFilter.name, playerFilter.url, playerStatsFilters)
      ),
      _.map(franchiseFilters, franchiseFilter =>
        franchiseAnalysisResult(franchiseFilter.id, franchiseFilter.name, franchiseFilter.url, franchiseStatsFilters)
      ),
      _.size(playerFilters) === 2
        ? playerComparisonResult(
            playerFilters[0].id,
            playerFilters[0].name,
            playerFilters[1].id,
            playerFilters[1].name,
            `/dashboard/comparison/players?playerId1=${playerFilters[0].id}&playerId2=${playerFilters[1].id}`,
            playerStatsFilters
          )
        : [],
      _.size(franchiseFilters) === 2
        ? franchiseComparisonResult(
            franchiseFilters[0].id,
            franchiseFilters[0].name,
            franchiseFilters[1].id,
            franchiseFilters[1].name,
            `/dashboard/comparison/franchise?franchiseId1=${franchiseFilters[0].id}&franchiseId2=${franchiseFilters[1].id}`,
            franchiseStatsFilters
          )
        : []
    );
  };

  const results = (
    <DataList aria-label="search results" onSelectDataListItem={() => {}}>
      {searchResults()}
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
                <Stack gutter="md">
                  <StackItem>
                    <Autosuggest
                      multiSection={true}
                      suggestions={data.suggestions}
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSuggestionsClearRequested}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      renderSectionTitle={renderSectionTitle}
                      getSectionSuggestions={getSectionSuggestions}
                      inputProps={inputProps}
                      renderInputComponent={inputComponent}
                      renderSuggestionsContainer={renderSuggestionsContainer}
                      onSuggestionSelected={onSuggestionSelected}
                    />
                  </StackItem>
                  <StackItem>
                    <ChipGroup>
                      {data.filters.map(filter => (
                        <Chip key={`${filter.category}-${filter.name}`} onClick={() => onDeleteFilter(filter)}>
                          {`${categoryToLabel[filter.category]}: ${filter.name}`}
                        </Chip>
                      ))}
                    </ChipGroup>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem isFilled>
            <Card>
              <CardBody style={{ padding: 0 }}>{_.isEmpty(data.filters) ? noResults : results}</CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default Search;
