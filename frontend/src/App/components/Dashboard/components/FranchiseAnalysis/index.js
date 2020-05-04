import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Bullseye,
  Card,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  InputGroup,
  InputGroupText,
  PageSection,
  PageSectionVariants,
  Select,
  SelectOption,
  SelectVariant,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  Tab,
  Tabs,
  Text,
  TextContent,
  TextInput,
  TextList,
  TextListItem,
  TextVariants,
  Title
} from '@patternfly/react-core';
import _ from 'lodash';
import { AuthContext } from '../../../../Auth';
import { CalendarAltIcon, SearchIcon } from '@patternfly/react-icons';
import { useLocation } from 'react-router-dom';
import AttemptsVsMadeAreaChart from '../../charts/AttemptsVsMadeAreaChart';
import AttemptsVsMadeChart from '../../charts/AttemptsVsMadeChart';
import Avatar from 'react-avatar';
import GameSearch from '../GameSearch';
import { formatGame } from '../GameSearch';
import GeneralStatsAreaChart from '../../charts/GeneralStatsAreaChart';
import GeneralStatsChart from '../../charts/GeneralStatsChart';
import moment from 'moment';
import FranchiseSearch from '../FranchiseSearch';
import PointsVsAssistsAreaChart from '../../charts/PointsVsAssistsAreaChart';
import PointsVsAssistsChart from '../../charts/PointsVsAssistsChart';
import queryString from 'query-string';
import ReboundsAreaChart from '../../charts/ReboundsAreaChart';
import ReboundsChart from '../../charts/ReboundsChart';

const initialState = {
  loading: {
    franchise: false,
    sportsDb: false,
    franchiseStatsOverall: false,
    franchiseStatsBySeason: false,
    franchiseStatsByGame: false
  },
  expanded: {
    overall: 'attempts-vs-made',
    season: 'attempts-vs-made',
    game: 'attempts-vs-made'
  },
  loadingSportsDb: false,
  franchiseData: {},
  franchiseStatsOverall: {},
  franchiseStatsBySeason: {},
  franchiseStatsByGame: {},
  selectedFranchise: {},
  selectedGameID: null,
  selectedGame: null,
  selectedGameMonthYear: null,
  sportsDbData: {},
  activeTabKey: 0,
  activeTabKeyFromUrl: false,
  seasonSelectIsExpanded: false,
  selectedSeasons: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FRANCHISE_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchise: true,
          sportsDb: true,
          franchiseStatsOverall: _.isNil(action.payload.tabIndex) || action.payload.tabIndex === 0,
          franchiseStatsBySeason: action.payload.tabIndex === 1,
          franchiseStatsByGame: action.payload.tabIndex === 2
        },
        franchiseData: {},
        franchiseStatsOverall: {},
        franchiseStatsBySeason: {},
        franchiseStatsByGame: {},
        selectedSeasons: [],
        selectedFranchise: action.payload.franchise,
        activeTabKey: _.isNil(action.payload.tabIndex) ? state.activeTabKey : action.payload.tabIndex,
        activeTabKeyFromUrl: !_.isNil(action.payload.tabIndex)
      };
    case 'FETCH_SPORTSDB_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          sportsDb: false
        },
        loadingSportsDb: false,
        sportsDbData: action.payload.franchise
      };
    case 'FETCH_FRANCHISE_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchise: false
        },
        franchiseData: action.payload.franchise
      };
    case 'FETCH_FRANCHISE_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchise: false
        },
        franchiseData: action.payload.franchise
      };
    case 'FETCH_GAME_REQUEST':
      return {
        ...state,
        selectedGameID: action.payload.selectedGameID,
        selectedGameMonthYear: action.payload.selectedGameMonthYear
      };
    case 'FETCH_GAME_SUCCESS':
      return {
        ...state,
        selectedGame: action.payload.game
      };
    case 'FETCH_FRANCHISE_STATS_OVERALL_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchiseStatsOverall: false
        },
        franchiseStatsOverall: action.payload.stats
      };
    case 'FETCH_FRANCHISE_STATS_BY_SEASON_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchiseStatsBySeason: true
        }
      };
    case 'FETCH_FRANCHISE_STATS_BY_SEASON_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchiseStatsBySeason: false
        },
        franchiseStatsBySeason: action.payload.stats
      };
    case 'FETCH_FRANCHISE_STATS_BY_GAME_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchiseStatsByGame: true
        }
      };
    case 'FETCH_FRANCHISE_STATS_BY_GAME_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          franchiseStatsByGame: false
        },
        franchiseStatsByGame: action.payload.stats
      };
    case 'TAB_CHANGE':
      return {
        ...state,
        activeTabKey: action.payload.tabIndex,
        activeTabKeyFromUrl: false
      };
    case 'CHART_CHANGE_OVERALL':
      return {
        ...state,
        expanded: {
          ...state.expanded,
          overall: action.payload.value
        }
      };
    case 'CHART_CHANGE_SEASON':
      return {
        ...state,
        expanded: {
          ...state.expanded,
          season: action.payload.value
        }
      };
    case 'CHART_CHANGE_GAME':
      return {
        ...state,
        expanded: {
          ...state.expanded,
          game: action.payload.value
        }
      };
    case 'GAME_MONTH_YEAR_CHANGE':
      return {
        ...state,
        selectedGameMonthYear: action.payload.value
      };
    case 'SEASON_SELECT_TOGGLE':
      return {
        ...state,
        seasonSelectIsExpanded: action.payload.isExpanded
      };
    case 'UPDATE_SELECTED_SEASONS':
      return {
        ...state,
        selectedSeasons: action.payload.selectedSeasons
      };
    case 'GAME_SELECTED':
      return {
        ...state,
        selectedGame: action.payload.game,
        selectedGameID: action.payload.game.id
      };
    case 'SEASON_SELECT_CLEAR':
      return {
        ...state,
        selectedSeasons: [],
        seasonSelectIsExpanded: false
      };
    case 'FAVORITE_TOGGLED':
      return {
        ...state,
        franchiseData: {
          ...state.franchiseData,
          isFavorite: !state.franchiseData.isFavorite
        }
      };
    default:
      return state;
  }
};

const tabNameToId = {
  Overall: 0,
  BySeason: 1,
  ByGame: 2
};

const FranchiseAnalysis = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);
  const urlParams = queryString.parse(useLocation().search);

  // Load data from the backend and thesportsdb.com as soon as a franchise has been seleted
  React.useEffect(() => {
    Promise.all([
      fetchFranchiseData(_.get(data.selectedFranchise, 'id')),
      fetchSportsDb(`${_.get(data.selectedFranchise, 'city')} ${_.get(data.selectedFranchise, 'nickname')}`),
      fetchTabData()
    ]);
  }, [data.selectedFranchise]);

  React.useEffect(() => {
    if (_.isEmpty(data.selectedFranchise) || data.activeTabKeyFromUrl) return;
    fetchTabData();
  }, [data.activeTabKey]);

  React.useEffect(() => {
    if (_.isNil(data.selectedGameID)) return;
    dispatch({ type: 'FETCH_FRANCHISE_STATS_BY_GAME_REQUEST' });
    fetchFranchiseStatsData(data.selectedFranchise.id, false, data.selectedGameID);
  }, [data.selectedGameID]);

  React.useEffect(() => {
    if (!_.isNil(urlParams.id) && !_.isNil(urlParams.name)) {
      dispatch({
        type: 'FETCH_FRANCHISE_REQUEST',
        payload: {
          franchiseId: _.toInteger(urlParams.id),
          franchiseName: urlParams.name,
          tabIndex: tabNameToId[_.get(urlParams, 'tab', 0)]
        }
      });
    }
    if (!_.isNil(urlParams.gameId) && !_.isNil(urlParams.gameMonthYear)) {
      dispatch({
        type: 'FETCH_GAME_REQUEST',
        payload: {
          selectedGameID: _.get(urlParams, 'gameId'),
          selectedGameMonthYear: _.get(urlParams, 'gameMonthYear')
        }
      });
      fetchGameData(_.get(urlParams, 'gameId'));
    }
  }, []);

  const fetchTabData = () => {
    switch (data.activeTabKey) {
      case 0:
        if (_.isEmpty(data.franchiseStatsOverall)) {
          fetchFranchiseStatsData(_.get(data.selectedFranchise, 'id'));
        }
        break;
      case 1:
        if (_.isEmpty(data.franchiseStatsBySeason)) {
          dispatch({ type: 'FETCH_FRANCHISE_STATS_BY_SEASON_REQUEST' });
          fetchFranchiseStatsData(_.get(data.selectedFranchise, 'id'), true);
        }
        break;
    }
  };

  const fetchSportsDb = franchiseName => {
    if (!franchiseName) return;
    fetch(`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${franchiseName}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises =>
        dispatch({
          type: 'FETCH_SPORTSDB_SUCCESS',
          payload: {
            franchise: _.head(franchises.teams)
          }
        })
      )
      .catch(error => {
        props.showAlert('Could not load franchise data from TheSportsDB.com 😔', 'danger');
      });
  };

  const fetchGameData = gameId => {
    if (!gameId) return;
    fetch(`${BACKEND}/api/game/${gameId}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(game =>
        dispatch({
          type: 'FETCH_GAME_SUCCESS',
          payload: { game }
        })
      )
      .catch(error => {
        props.showAlert('Could not load game data 😔', 'danger');
      });
  };

  const fetchFranchiseData = franchiseId => {
    if (!franchiseId) return;
    fetch(`${BACKEND}/api/franchise/${franchiseId}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchise =>
        dispatch({
          type: 'FETCH_FRANCHISE_SUCCESS',
          payload: { franchise }
        })
      )
      .catch(error => {
        props.showAlert('Could not load franchise data 😔', 'danger');
      });
  };

  const fetchFranchiseStatsData = (franchiseId, bySeason, game) => {
    if (!franchiseId) return;

    let url = `${BACKEND}/api/franchise/${franchiseId}/stats`;
    let eventType = 'FETCH_FRANCHISE_STATS_OVERALL_SUCCESS';

    if (bySeason) {
      url += `/season`;
      eventType = 'FETCH_FRANCHISE_STATS_BY_SEASON_SUCCESS';
    } else if (!_.isNil(game)) {
      url += `/game/${game}`;
      eventType = 'FETCH_FRANCHISE_STATS_BY_GAME_SUCCESS';
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(stats =>
        dispatch({
          type: eventType,
          payload: { stats }
        })
      )
      .catch(error => {
        props.showAlert('Could not load franchise stats data 😔', 'danger');
      });
  };

  const onToggleFavorite = franchise => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/franchise/${franchise.id}`, {
      method: franchise.isFavorite ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else dispatch({ type: 'FAVORITE_TOGGLED' });
      })
      .catch(error => {
        props.showAlert('Could not toggle favorite 😔', 'danger');
      });
  };

  const onFranchiseSelect = (franchise) => {
    dispatch({
      type: 'FETCH_FRANCHISE_REQUEST',
      payload: {
        franchise
      }
    });
  };

  const onTabClick = (_, tabIndex) => {
    dispatch({
      type: 'TAB_CHANGE',
      payload: { tabIndex }
    });
  };

  const photo = _.get(data.sportsDbData, 'strTeamBadge') ? (
    <Bullseye>
      <Avatar src={data.sportsDbData.strTeamBadge} color="#ecedec" size="250px" round />
    </Bullseye>
  ) : (
    <Bullseye>
      <Avatar value="Franchise" color="#ecedec" size="250px" round />
    </Bullseye>
  );

  const tabPlaceholder = text => (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h5" size="lg">
            {text ? text : 'No Franchise Selected.'}
          </Title>
        </EmptyState>
      </CardBody>
    </Card>
  );

  const loadingPlaceholder = text => (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon variant="container" component={Spinner} />
          <Title size="lg">{text ? text : 'Loading Franchise Stats.'}</Title>
        </EmptyState>
      </CardBody>
    </Card>
  );

  const tabToChartChangeEvent = {
    overall: 'CHART_CHANGE_OVERALL',
    bySeason: 'CHART_CHANGE_SEASON',
    byGame: 'CHART_CHANGE_GAME'
  };

  const onSeasonToggle = isExpanded => {
    dispatch({
      type: 'SEASON_SELECT_TOGGLE',
      payload: { isExpanded }
    });
  };

  const onSeasonClear = () => {
    dispatch({
      type: 'SEASON_SELECT_CLEAR'
    });
  };

  const onGameSelect = game => {
    dispatch({
      type: 'GAME_SELECTED',
      payload: { game }
    });
  };

  const onGameMonthYearChange = value => {
    dispatch({
      type: 'GAME_MONTH_YEAR_CHANGE',
      payload: { value }
    });
  };

  const onSeasonSelect = (evt, selection) => {
    dispatch({
      type: 'UPDATE_SELECTED_SEASONS',
      payload: {
        selectedSeasons: _.includes(data.selectedSeasons, selection)
          ? _.filter(data.selectedSeasons, season => season !== selection)
          : _.union(data.selectedSeasons, [selection])
      }
    });
  };

  const seasonSelect = (
    <Card isCompact>
      <CardBody>
        <Select
          variant={SelectVariant.typeaheadMulti}
          ariaLabelTypeAhead="Select a season"
          onToggle={onSeasonToggle}
          onSelect={onSeasonSelect}
          onClear={onSeasonClear}
          selections={data.selectedSeasons}
          isExpanded={data.seasonSelectIsExpanded}
          placeholderText="Select a season"
        >
          {_.map(data.franchiseStatsBySeason, el => (
            <SelectOption key={el.season} value={`${el.season}`} />
          ))}
        </Select>
      </CardBody>
    </Card>
  );

  const gameSelect = (
    <Card isCompact>
      <CardBody>
        <Stack gutter="md">
          <StackItem style={{ minHeight: '2.25rem' }}>
            <Title headingLevel="h6" size="md">
              Step 1: Select a year and month
            </Title>
            <InputGroup>
              <InputGroupText component="label" htmlFor="month-year">
                <CalendarAltIcon />
              </InputGroupText>
              <TextInput
                name="month-year"
                id="month-year"
                type="month"
                aria-label="Month and Year"
                min="2003-10"
                max="2020-03"
                onChange={onGameMonthYearChange}
              />
            </InputGroup>
          </StackItem>
          <StackItem>
            <Title headingLevel="h6" size="md">
              Step 2: Select a game from your selected time range
            </Title>
            <GameSearch
              onGameSelect={onGameSelect}
              onError={error => props.showAlert(error, 'danger')}
              width="100%"
              filterByFranchise
              selectedMonthYear={data.selectedGameMonthYear}
              selectedFranchise={data.selectedFranchise}
            />
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );

  const charts = (expanded, franchiseData, onToggle, tab) => (
    <React.Fragment>
      <Accordion asDefinitionList noBoxShadow>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'attempts-vs-made');
            }}
            isExpanded={expanded === 'attempts-vs-made'}
            id="attempts-vs-made"
          >
            Attempts vs. Made
          </AccordionToggle>
          <AccordionContent id="attempts-vs-made" isHidden={expanded !== 'attempts-vs-made'}>
            {_.isArray(franchiseData) ? (
              <AttemptsVsMadeAreaChart data={franchiseData} />
            ) : (
              <AttemptsVsMadeChart data={franchiseData} />
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'rebounds');
            }}
            isExpanded={expanded === 'rebounds'}
            id="rebounds"
          >
            Rebounds
          </AccordionToggle>
          <AccordionContent id="rebounds" isHidden={expanded !== 'rebounds'}>
            {_.isArray(franchiseData) ? (
              <ReboundsAreaChart data={franchiseData} />
            ) : (
              <ReboundsChart data={franchiseData} />
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'points-vs-assists');
            }}
            isExpanded={expanded === 'points-vs-assists'}
            id="points-vs-assists"
          >
            Points vs. Assists
          </AccordionToggle>
          <AccordionContent id="points-vs-assists" isHidden={expanded !== 'points-vs-assists'}>
            {_.isArray(franchiseData) ? (
              <PointsVsAssistsAreaChart data={franchiseData} />
            ) : (
              <PointsVsAssistsChart data={franchiseData} />
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'general-stats');
            }}
            isExpanded={expanded === 'general-stats'}
            id="general-stats"
          >
            General Stats
          </AccordionToggle>
          <AccordionContent id="general-stats" isHidden={expanded !== 'general-stats'}>
            {_.isArray(franchiseData) ? (
              <GeneralStatsAreaChart data={franchiseData} />
            ) : (
              <GeneralStatsChart data={franchiseData} />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </React.Fragment>
  );

  const onToggle = (type, value) => {
    dispatch({
      type,
      payload: { value }
    });
  };

  const filterBySelectedSeason = seasonData => {
    if (_.isEmpty(data.selectedSeasons)) return seasonData;
    const result = _.filter(seasonData, el => _.includes(data.selectedSeasons, _.toString(el.season)));
    if (_.eq(_.size(result), 1)) return _.head(result);
    return result;
  };

  const formatFranchise = `${data.franchiseData.city} ${data.franchiseData.nickname}`;

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>Franchise Analysis</Text>
          <Text component="p">Search for an NBA franchise and explore the stats.</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Stack gutter="md">
          <StackItem>
            <Split gutter="md">
              <SplitItem isFilled>
                <Card>
                  <CardBody>
                    <Stack gutter="md">
                      <StackItem style={{ minHeight: '2.25rem' }}>
                        <FranchiseSearch
                          onFranchiseSelect={onFranchiseSelect}
                          onError={error => props.showAlert(error, 'danger')}
                          width="100%"
                        />
                      </StackItem>
                      <StackItem isFilled>
                        <TextContent>
                          <Title headingLevel="h3" size="2xl">
                            {!_.isEmpty(data.franchiseData) ? formatFranchise : '...'}
                          </Title>
                          <TextList component="dl">
                            <TextListItem component="dt">Favorite</TextListItem>
                            <TextListItem component="dd">
                              {_.has(data.franchiseData, 'isFavorite') ? (
                                <Switch
                                  id="franchise-details-is-favorite"
                                  isChecked={_.get(data.franchiseData, 'isFavorite', false)}
                                  onChange={() => onToggleFavorite(data.franchiseData)}
                                />
                              ) : (
                                ''
                              )}
                            </TextListItem>
                            <TextListItem component="dt">Year Founded</TextListItem>
                            <TextListItem component="dd">{_.get(data.franchiseData, 'yearFounded', '')}</TextListItem>
                            <TextListItem component="dt">Arena</TextListItem>
                            <TextListItem component="dd">{_.get(data.franchiseData, 'arena', '')}</TextListItem>
                            <TextListItem component="dt">Abbreviation</TextListItem>
                            <TextListItem component="dd">{_.get(data.franchiseData, 'abbreviation', '')}</TextListItem>
                          </TextList>
                        </TextContent>
                      </StackItem>
                    </Stack>
                  </CardBody>
                </Card>
              </SplitItem>
              <SplitItem>
                <Bullseye>{photo}</Bullseye>
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem>
            <Card>
              <CardBody style={{ padding: 0 }}>
                <Tabs isFilled activeKey={_.isNil(data.activeTabKey) ? 0 : data.activeTabKey} onSelect={onTabClick}>
                  <Tab eventKey={0} title="Overall">
                    {data.loading.franchiseStatsOverall
                      ? loadingPlaceholder()
                      : _.isEmpty(data.franchiseStatsOverall)
                      ? tabPlaceholder()
                      : charts(data.expanded.overall, data.franchiseStatsOverall, onToggle, 'overall')}
                  </Tab>
                  <Tab eventKey={1} title="By Season">
                    {data.loading.franchiseStatsBySeason ? (
                      loadingPlaceholder()
                    ) : _.isEmpty(data.franchiseStatsBySeason) ? (
                      tabPlaceholder()
                    ) : (
                      <React.Fragment>
                        {seasonSelect}
                        {charts(
                          data.expanded.season,
                          filterBySelectedSeason(data.franchiseStatsBySeason),
                          onToggle,
                          'bySeason'
                        )}
                      </React.Fragment>
                    )}
                  </Tab>
                  <Tab eventKey={2} title="By Game">
                    <Stack gutter="md">
                      <StackItem>{gameSelect}</StackItem>
                      <StackItem isFilled>
                        {data.loading.franchiseStatsByGame ? (
                          loadingPlaceholder()
                        ) : _.isEmpty(data.franchiseStatsByGame) ? (
                          tabPlaceholder('No Franchise / Game Selected.')
                        ) : (
                          <React.Fragment>
                            <Bullseye>
                              <Title headingLevel="h3" size="2xl">
                                {_.isEmpty(data.selectedGame) ? '...' : formatGame(data.selectedGame)}
                              </Title>
                            </Bullseye>
                            {charts(data.expanded.game, data.franchiseStatsByGame, onToggle, 'byGame')}
                          </React.Fragment>
                        )}
                      </StackItem>
                    </Stack>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default FranchiseAnalysis;
