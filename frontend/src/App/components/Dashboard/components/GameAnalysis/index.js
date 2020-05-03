import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  FlexModifiers,
  InputGroup,
  InputGroupText,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Stack,
  StackItem,
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
import { CalendarAltIcon, SearchIcon, ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import Avatar from 'react-avatar';
import { AuthContext } from '../../../../Auth';
import GameSearch from '../GameSearch';
import PlayerSearch from '../PlayerSearch';
import PercentageChart from '../../charts/PercentageChart';
import AssistsReboundsChart from '../../charts/AssistsReboundsChart';
import AssistsReboundsComparisonChart from '../../charts/AssistsReboundsComparisonChart';

const initialState = {
  activeTabKey: 1,
  selectedGame: {},
  selectedGamePlayers: {},
  selectedPlayer: {
    home: null,
    visitor: null
  },
  selectedMonthYear: null,
  sportsDbDataHome: {},
  sportsDbDataVisitor: {},
  loading: {
    sportsDbHome: false,
    sportsDbVisitor: false,
    players: false
  },
  expanded: {
    home: 'percentages',
    comparison: 'field-goals',
    visitor: 'percentages'
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'MONTH_YEAR_CHANGE':
      return {
        ...state,
        selectedMonthYear: action.payload.value
      };
    case 'GAME_SELECTED':
      return {
        ...state,
        selectedGame: action.payload.game
      };
    case 'FETCH_SPORTSDB_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          sportsDbHome: true,
          sportsDbVisitor: true
        },
        sportsDbDataHome: {},
        sportsDbDataVisitor: {}
      };
    case 'FETCH_SPORTSDB_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          sportsDbHome: _.eq(action.payload.type, 'home') ? false : state.sportsDbHome,
          sportsDbVisitor: _.eq(action.payload.type, 'visitor') ? false : state.sportsDbHome
        },
        sportsDbDataHome: _.eq(action.payload.type, 'home') ? action.payload.franchise : state.sportsDbDataHome,
        sportsDbDataVisitor: _.eq(action.payload.type, 'visitor') ? action.payload.franchise : state.sportsDbDataVisitor
      };
    case 'FETCH_PLAYERS_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          players: true
        },
        selectedGamePlayers: {}
      };
    case 'FETCH_PLAYERS_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          players: false
        },
        selectedGamePlayers: _.groupBy(action.payload.players, 'franchise')
      };
    case 'PLAYER_SELECTED_HOME':
      return {
        ...state,
        selectedPlayer: {
          ...state.selectedPlayer,
          home: action.payload.player
        }
      };
    case 'PLAYER_SELECTED_VISITOR':
      return {
        ...state,
        selectedPlayer: {
          ...state.selectedPlayer,
          visitor: action.payload.player
        }
      };
    case 'TAB_CHANGE':
      return {
        ...state,
        activeTabKey: action.payload.tabIndex
      };
    case 'CHART_CHANGE_HOME':
      return {
        ...state,
        expanded: {
          ...state.expanded,
          home: action.payload.value
        }
      };
    case 'CHART_CHANGE_COMPARISON':
      return {
        ...state,
        expanded: {
          ...state.expanded,
          comparison: action.payload.value
        }
      };
    case 'CHART_CHANGE_VISITOR':
      return {
        ...state,
        expanded: {
          ...state.expanded,
          visitor: action.payload.value
        }
      };
    default:
      return state;
  }
};

const GamesAnalysis = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);
  const history = useHistory();

  React.useEffect(() => {
    if (_.isEmpty(data.selectedGame)) return;
    dispatch({ type: 'FETCH_SPORTSDB_REQUEST' });
    dispatch({ type: 'FETCH_PLAYERS_REQUEST' });
    Promise.all([fetchSportsDb('home'), fetchSportsDb('visitor'), fetchPlayers(data.selectedGame.id)]);
  }, [data.selectedGame]);

  const fetchSportsDb = type => {
    if (!type) return;
    fetch(`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${formatFranchise(type)}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises =>
        dispatch({
          type: 'FETCH_SPORTSDB_SUCCESS',
          payload: {
            franchise: _.head(franchises.teams),
            type
          }
        })
      )
      .catch(error => {
        dispatch({ type: 'FETCH_SPORTSDB_FAILURE' });
        props.showAlert('Could not load franchise data from TheSportsDB.com 😔', 'danger');
      });
  };

  const fetchPlayers = gameId => {
    if (!gameId) return;
    fetch(`${BACKEND}/api/game/${gameId}/players`, {
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
          payload: { players }
        })
      )
      .catch(error => {
        props.showAlert('Could not load players 😔', 'danger');
      });
  };

  const formatFranchise = type =>
    _.eq(type, 'home')
      ? `${data.selectedGame.homeCity} ${data.selectedGame.homeNickname}`
      : `${data.selectedGame.visitorCity} ${data.selectedGame.visitorNickname}`;

  const onMonthYearChange = value => {
    dispatch({
      type: 'MONTH_YEAR_CHANGE',
      payload: { value }
    });
  };

  const onTabClick = (_, tabIndex) => {
    dispatch({
      type: 'TAB_CHANGE',
      payload: { tabIndex }
    });
  };

  const onGameSelect = game => {
    dispatch({
      type: 'GAME_SELECTED',
      payload: { game }
    });
  };

  const onPlayerSelect = (player, tab) => {
    dispatch({
      type: tab === 'home' ? 'PLAYER_SELECTED_HOME' : 'PLAYER_SELECTED_VISITOR',
      payload: { player }
    });
  };

  const onToggle = (type, value) => {
    dispatch({
      type,
      payload: { value }
    });
  };

  const onInspectByPlayerClick = tab => {
    if (!_.isNil(data.selectedPlayer[tab])) {
      history.push(
        `/dashboard/analysis/player?id=${data.selectedPlayer[tab].id}&name=${
          data.selectedPlayer[tab].name
        }&tab=ByGame&gameId=${data.selectedGame.id}&gameMonthYear=${moment(data.selectedGame.date).format('YYYY-MM')}`
      );
    }
  };

  const photo = (sportsDbData, defaultValue) =>
    _.get(sportsDbData, 'strTeamBadge') ? (
      <Bullseye>
        <Avatar src={sportsDbData.strTeamBadge} color="#ecedec" size="150px" />
      </Bullseye>
    ) : (
      <Bullseye>
        <Avatar value={defaultValue} color="#ecedec" size="150px" round />
      </Bullseye>
    );

  const points = value => (
    <Bullseye>
      <Avatar value={_.toString(value)} color="#ecedec" size="150px" round />
    </Bullseye>
  );

  const tabPlaceholder = (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h5" size="lg">
            No Game Selected.
          </Title>
        </EmptyState>
      </CardBody>
    </Card>
  );

  const tabToChartChangeEvent = {
    home: 'CHART_CHANGE_HOME',
    comparison: 'CHART_CHANGE_COMPARISON',
    visitor: 'CHART_CHANGE_VISITOR'
  };

  const franchiseCharts = (expanded, onToggle, tab) => (
    <React.Fragment>
      <Card>
        <CardHeader>Inspect By Player</CardHeader>
        <CardBody>
          <Split gutter="md">
            <SplitItem isFilled>
              <PlayerSearch
                onPlayerSelect={(id, name) => onPlayerSelect({ id, name }, tab)}
                onError={error => props.showAlert(error, 'danger')}
                width="100%"
                useLocal
                players={_.get(
                  data.selectedGamePlayers,
                  _.eq(tab, 'home') ? data.selectedGame.homeFranchise : data.selectedGame.visitorFranchise
                )}
              />
            </SplitItem>
            <SplitItem>
              <Button aria-label="Action" onClick={() => onInspectByPlayerClick(tab)}>
                <ExternalLinkSquareAltIcon />
              </Button>
            </SplitItem>
          </Split>
        </CardBody>
      </Card>
      <Divider />
      <Accordion asDefinitionList noBoxShadow>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'percentages');
            }}
            isExpanded={expanded === 'percentages'}
            id="percentages"
          >
            Field Goals, Free Throws, and Three Pointers (%)
          </AccordionToggle>
          <AccordionContent id="percentages" isHidden={expanded !== 'percentages'}>
            <Split gutter="md">
              <SplitItem isFilled>
                <PercentageChart
                  label="Field Goals"
                  value={
                    _.eq(tab, 'home')
                      ? data.selectedGame.homeFieldGoalPercentage
                      : data.selectedGame.awayFieldGoalPercentage
                  }
                />
              </SplitItem>
              <SplitItem isFilled>
                <PercentageChart
                  label="Free Throws"
                  value={
                    _.eq(tab, 'home')
                      ? data.selectedGame.homeFreeThrowPercentage
                      : data.selectedGame.awayFreeThrowPercentage
                  }
                />
              </SplitItem>
              <SplitItem isFilled>
                <PercentageChart
                  label="Three Pointers"
                  value={
                    _.eq(tab, 'home')
                      ? data.selectedGame.homeThreePointerPercentage
                      : data.selectedGame.awayThreePointerPercentage
                  }
                />
              </SplitItem>
            </Split>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'assists-rebounds');
            }}
            isExpanded={expanded === 'assists-rebounds'}
            id="assists-rebounds"
          >
            Assists and Rebounds
          </AccordionToggle>
          <AccordionContent id="assists-rebounds" isHidden={expanded !== 'assists-rebounds'}>
            <AssistsReboundsChart
              assists={_.eq(tab, 'home') ? data.selectedGame.homeAssists : data.selectedGame.awayAssists}
              rebounds={_.eq(tab, 'home') ? data.selectedGame.homeRebounds : data.selectedGame.awayRebounds}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </React.Fragment>
  );

  const comparisonCharts = (expanded, onToggle, tab) => (
    <React.Fragment>
      <Accordion asDefinitionList noBoxShadow>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'field-goals');
            }}
            isExpanded={expanded === 'field-goals'}
            id="field-goals"
          >
            Field Goals (%)
          </AccordionToggle>
          <AccordionContent id="field-goals" isHidden={expanded !== 'field-goals'}>
            <Split gutter="md">
              <SplitItem isFilled>
                <Stack gutter="md">
                  <StackItem>
                    <Bullseye>{formatFranchise('home')}</Bullseye>
                  </StackItem>
                  <StackItem isFilled>
                    <PercentageChart label="Field Goals" value={data.selectedGame.homeFieldGoalPercentage} />
                  </StackItem>
                </Stack>
              </SplitItem>
              <SplitItem isFilled>
                <Stack gutter="md">
                  <StackItem>
                    <Bullseye>{formatFranchise('visitor')}</Bullseye>
                  </StackItem>
                  <StackItem isFilled>
                    <PercentageChart label="Field Goals" value={data.selectedGame.awayFieldGoalPercentage} />
                  </StackItem>
                </Stack>
              </SplitItem>
            </Split>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'free-throws');
            }}
            isExpanded={expanded === 'free-throws'}
            id="free-throws"
          >
            Free Throws (%)
          </AccordionToggle>
          <AccordionContent id="free-throws" isHidden={expanded !== 'free-throws'}>
            <Split gutter="md">
              <SplitItem isFilled>
                <Stack gutter="md">
                  <StackItem>
                    <Bullseye>{formatFranchise('home')}</Bullseye>
                  </StackItem>
                  <StackItem isFilled>
                    <PercentageChart label="Free Throws" value={data.selectedGame.homeFreeThrowPercentage} />
                  </StackItem>
                </Stack>
              </SplitItem>
              <SplitItem isFilled>
                <Stack gutter="md">
                  <StackItem>
                    <Bullseye>{formatFranchise('visitor')}</Bullseye>
                  </StackItem>
                  <StackItem isFilled>
                    <PercentageChart label="Free Throws" value={data.selectedGame.awayFreeThrowPercentage} />
                  </StackItem>
                </Stack>
              </SplitItem>
            </Split>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'three-pointer');
            }}
            isExpanded={expanded === 'three-pointer'}
            id="three-pointer"
          >
            Three Pointer (%)
          </AccordionToggle>
          <AccordionContent id="three-pointer" isHidden={expanded !== 'three-pointer'}>
            <Split gutter="md">
              <SplitItem isFilled>
                <Stack gutter="md">
                  <StackItem>
                    <Bullseye>{formatFranchise('home')}</Bullseye>
                  </StackItem>
                  <StackItem isFilled>
                    <PercentageChart label="Three Pointers" value={data.selectedGame.homeThreePointerPercentage} />
                  </StackItem>
                </Stack>
              </SplitItem>
              <SplitItem isFilled>
                <Stack gutter="md">
                  <StackItem>
                    <Bullseye>{formatFranchise('visitor')}</Bullseye>
                  </StackItem>
                  <StackItem isFilled>
                    <PercentageChart label="Three Pointers" value={data.selectedGame.awayThreePointerPercentage} />
                  </StackItem>
                </Stack>
              </SplitItem>
            </Split>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle(tabToChartChangeEvent[tab], 'assists-rebounds');
            }}
            isExpanded={expanded === 'assists-rebounds'}
            id="assists-rebounds"
          >
            Assists and Rebounds
          </AccordionToggle>
          <AccordionContent id="assists-rebounds" isHidden={expanded !== 'assists-rebounds'}>
            <AssistsReboundsComparisonChart
              homeFranchise={formatFranchise('home')}
              visitorFranchise={formatFranchise('visitor')}
              homeAssists={data.selectedGame.homeAssists}
              homeRebounds={data.selectedGame.homeRebounds}
              awayAssists={data.selectedGame.awayAssists}
              awayRebounds={data.selectedGame.awayRebounds}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>Game Analysis</Text>
          <Text component="p">Dive into the stats of your favorite games.</Text>
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
                            onChange={onMonthYearChange}
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
                          selectedMonthYear={data.selectedMonthYear}
                        />
                      </StackItem>
                      <StackItem isFilled>
                        <TextContent>
                          <TextList component="dl">
                            <TextListItem component="dt">Season</TextListItem>
                            <TextListItem component="dd">{_.get(data.selectedGame, 'season', '')}</TextListItem>
                            <TextListItem component="dt">Date</TextListItem>
                            <TextListItem component="dd">
                              {_.has(data.selectedGame, 'date') ? moment(data.selectedGame.date).format('ll') : ''}
                            </TextListItem>
                            <TextListItem component="dt">Home</TextListItem>
                            <TextListItem component="dd">
                              {!_.isEmpty(data.sportsDbDataHome) ? (
                                <Button
                                  variant="link"
                                  isInline
                                  icon={<ExternalLinkSquareAltIcon />}
                                  iconPosition="right"
                                >
                                  {formatFranchise('home')}
                                </Button>
                              ) : (
                                ''
                              )}
                            </TextListItem>
                            <TextListItem component="dt">Visitor</TextListItem>
                            <TextListItem component="dd">
                              {!_.isEmpty(data.sportsDbDataHome) ? (
                                <Button
                                  variant="link"
                                  isInline
                                  icon={<ExternalLinkSquareAltIcon />}
                                  iconPosition="right"
                                >
                                  {formatFranchise('visitor')}
                                </Button>
                              ) : (
                                ''
                              )}
                            </TextListItem>
                          </TextList>
                        </TextContent>
                      </StackItem>
                    </Stack>
                  </CardBody>
                </Card>
              </SplitItem>
              <SplitItem>
                <Bullseye>
                  <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
                    <FlexItem>{photo(data.sportsDbDataHome, 'Home')}</FlexItem>
                    <FlexItem>{points(data.selectedGame.homePoints)}</FlexItem>
                  </Flex>
                </Bullseye>
              </SplitItem>
              <SplitItem>
                <Bullseye>
                  <Avatar value="vs." color="#ecedec" size="75px" fgColor="#4F5552" round />
                </Bullseye>
              </SplitItem>
              <SplitItem>
                <Bullseye>
                  <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
                    <FlexItem>{photo(data.sportsDbDataVisitor, 'Visitor')}</FlexItem>
                    <FlexItem>{points(data.selectedGame.awayPoints)}</FlexItem>
                  </Flex>
                </Bullseye>
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem>
            <Card>
              <CardBody style={{ padding: 0 }}>
                <Tabs isFilled mountOnEnter activeKey={data.activeTabKey} onSelect={onTabClick}>
                  <Tab
                    eventKey={0}
                    title={_.isEmpty(data.sportsDbDataHome) ? 'Home' : `Home: ${formatFranchise('home')}`}
                  >
                    {_.isEmpty(data.selectedGame)
                      ? tabPlaceholder
                      : franchiseCharts(data.expanded.home, onToggle, 'home')}
                  </Tab>
                  <Tab eventKey={1} title="Comparison">
                    {_.isEmpty(data.selectedGame) ? (
                      tabPlaceholder
                    ) : (
                      <React.Fragment>
                        {comparisonCharts(data.expanded.comparison, onToggle, 'comparison')}
                      </React.Fragment>
                    )}
                  </Tab>
                  <Tab
                    eventKey={2}
                    title={_.isEmpty(data.sportsDbDataVisitor) ? 'Visitor' : `Visitor: ${formatFranchise('visitor')}`}
                  >
                    {_.isEmpty(data.selectedGame)
                      ? tabPlaceholder
                      : franchiseCharts(data.expanded.visitor, onToggle, 'visitor')}
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

export default GamesAnalysis;
