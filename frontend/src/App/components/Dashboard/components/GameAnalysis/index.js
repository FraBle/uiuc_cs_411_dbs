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
import { CalendarAltIcon, SearchIcon } from '@patternfly/react-icons';
import moment from 'moment';
import _ from 'lodash';
import Avatar from 'react-avatar';
import { AuthContext } from '../../../../Auth';
import GameSearch from '../GameSearch';

const initialState = {
  activeTabKey: 0,
  selectedGame: {},
  selectedMonthYear: null,
  sportsDbDataHome: {},
  sportsDbDataVisitor: {},
  gameStatsHome: {},
  gameStatsComparison: {},
  gameStatsVisitor: {},
  loading: {
    sportsDbHome: false,
    sportsDbVisitor: false,
    gameStatsHome: false,
    gameStatsComparison: false,
    gameStatsVisitor: false
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
        sportsDbDataVisitor: {},
        gameStatsHome: {},
        gameStatsComparison: {},
        gameStatsVisitor: {}
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
    case 'TAB_CHANGE':
      return {
        ...state,
        activeTabKey: action.payload.tabIndex
      };
    default:
      return state;
  }
};

const GamesAnalysis = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (_.isEmpty(data.selectedGame)) return;
    dispatch({ type: 'FETCH_SPORTSDB_REQUEST' });
    Promise.all([fetchSportsDb('home'), fetchSportsDb('visitor'), fetchTabData()]);
  }, [data.selectedGame]);

  React.useEffect(() => {
    if (_.isEmpty(data.selectedGame)) return;
    fetchTabData();
  }, [data.activeTabKey]);

  const fetchTabData = () => {
    switch (data.activeTabKey) {
      case 0:
        if (_.isEmpty(data.gameStatsHome)) {
          console.log(`Fetch data for ${formatFranchise('home')}`);
        }
        break;
      case 1:
        if (_.isEmpty(data.gameStatsComparison)) {
          console.log(`Fetch data for ${formatFranchise('home')} vs. ${formatFranchise('visitor')}`);
        }
        break;
      case 2:
        if (_.isEmpty(data.gameStatsVisitor)) {
          console.log(`Fetch data for ${formatFranchise('visitor')}`);
        }
        break;
    }
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
    console.log(game);
    dispatch({
      type: 'GAME_SELECTED',
      payload: { game }
    });
  };

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

  const loadingPlaceholder = (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon variant="container" component={Spinner} />
          <Title size="lg">Loading Game Stats.</Title>
        </EmptyState>
      </CardBody>
    </Card>
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
                            <TextListItem component="dt">Game ID</TextListItem>
                            <TextListItem component="dd">{_.get(data.selectedGame, 'id', '')}</TextListItem>
                            <TextListItem component="dt">Season</TextListItem>
                            <TextListItem component="dd">{_.get(data.selectedGame, 'season', '')}</TextListItem>
                            <TextListItem component="dt">Date</TextListItem>
                            <TextListItem component="dd">
                              {_.has(data.selectedGame, 'date') ? moment(data.selectedGame.date).format('ll') : ''}
                            </TextListItem>
                            <TextListItem component="dt">Home</TextListItem>
                            <TextListItem component="dd">
                              {!_.isEmpty(data.sportsDbDataHome) ? `${formatFranchise('home')}` : ''}
                            </TextListItem>
                            <TextListItem component="dt">Visitor</TextListItem>
                            <TextListItem component="dd">
                              {!_.isEmpty(data.sportsDbDataHome) ? `${formatFranchise('visitor')}` : ''}
                            </TextListItem>
                          </TextList>
                        </TextContent>
                      </StackItem>
                    </Stack>
                  </CardBody>
                </Card>
              </SplitItem>
              <SplitItem>
                <Bullseye>{photo(data.sportsDbDataHome, 'Home')}</Bullseye>
              </SplitItem>
              <SplitItem>
                <Bullseye>
                  <Avatar value="vs." color="#ecedec" size="75px" fgColor="#4F5552" round />
                </Bullseye>
              </SplitItem>
              <SplitItem>
                <Bullseye>{photo(data.sportsDbDataVisitor, 'Visitor')}</Bullseye>
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
                    {data.loading.gameStatsHome
                      ? loadingPlaceholder
                      : _.isEmpty(data.gameStatsHome)
                      ? tabPlaceholder
                      : charts(data.expanded.overall, data.gameStatsHome, onToggle, 'home')}
                  </Tab>
                  <Tab eventKey={1} title="Comparison">
                    {data.loading.gameStatsComparison ? (
                      loadingPlaceholder
                    ) : _.isEmpty(data.gameStatsComparison) ? (
                      tabPlaceholder
                    ) : (
                      <React.Fragment>
                        {seasonSelect}
                        {charts(data.expanded.season, data.gameStatsComparison, onToggle, 'comparison')}
                      </React.Fragment>
                    )}
                  </Tab>
                  <Tab
                    eventKey={2}
                    title={_.isEmpty(data.sportsDbDataVisitor) ? 'Visitor' : `Visitor: ${formatFranchise('visitor')}`}
                  >
                    {data.loading.gameStatsVisitor
                      ? loadingPlaceholder
                      : _.isEmpty(data.gameStatsVisitor)
                      ? tabPlaceholder
                      : charts(data.expanded.game, data.gameStatsVisitor, onToggle, 'visitor')}
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
