import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Bullseye,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Gallery,
  GalleryItem,
  PageSection,
  PageSectionVariants,
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
  TextList,
  TextListItem,
  TextVariants,
  Title
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import moment from 'moment';
import _ from 'lodash';
import Avatar from 'react-avatar';
import { AuthContext } from '../../../../Auth';
import PlayerSearch from '../PlayerSearch';
import PlaceholderChart from '../../charts/PlaceholderChart';
import AttemptsVsMadeChart from '../../charts/AttemptsVsMadeChart';

const initialState = {
  loading: {
    player: false,
    sportsDb: false,
    playerStatsOverall: false,
    playerStatsBySeason: false,
    playerStatsByGame: false
  },
  expanded: {
    overall: 'attempts-vs-made',
    season: 'attempts-vs-made',
    game: 'attempts-vs-made'
  },
  loadingSportsDb: false,
  playerData: {},
  playerStatsOverall: {},
  playerStatsBySeason: {},
  playerStatsByGame: {},
  selectedPlayer: {},
  selectedSeason: null,
  selectedGame: null,
  sportsDbData: {},
  activeTabKey: 0
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PLAYER_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          player: true,
          sportsDb: true,
          playerStatsOverall: true
        },
        selectedPlayer: {
          id: action.payload.playerId,
          name: action.payload.playerName
        }
      };
    case 'FETCH_SPORTSDB_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          sportsDb: false
        },
        loadingSportsDb: false,
        sportsDbData: action.payload.player
      };
    case 'FETCH_PLAYER_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          player: false
        },
        playerData: action.payload.player
      };
    case 'FETCH_PLAYER_STATS_OVERALL_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          playerStatsOverall: false
        },
        playerStatsOverall: action.payload.playerStatsOverall
      };
    case 'FETCH_PLAYER_STATS_BY_SEASON_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          playerStatsBySeason: false
        },
        playerStatsBySeason: action.payload.playerStatsBySeason
      };
    case 'FETCH_PLAYER_STATS_BY_GAME_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          playerStatsByGame: false
        },
        playerStatsByGame: action.payload.playerStatsByGame
      };
    case 'TAB_CHANGE':
      return {
        ...state,
        activeTabKey: action.payload.tabIndex
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
    default:
      return state;
  }
};
const PlayerAnalysis = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  // Load data from the backend and thesportsdb.com as soon as a player has been seleted
  React.useEffect(() => {
    Promise.all([
      fetchPlayerData(_.get(data.selectedPlayer, 'id')),
      fetchSportsDb(_.get(data.selectedPlayer, 'name')),
      fetchPlayerStatsData(_.get(data.selectedPlayer, 'id'))
    ]);
  }, [data.selectedPlayer]);

  const fetchSportsDb = playerName => {
    if (!playerName) return;
    fetch(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=${playerName}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(playerJson =>
        dispatch({
          type: 'FETCH_SPORTSDB_SUCCESS',
          payload: {
            player: playerJson.player ? playerJson.player[0] : null
          }
        })
      )
      .catch(error => {
        props.showAlert('Could not load player data from TheSportsDB.com 😔', 'danger');
      });
  };

  const fetchPlayerData = playerId => {
    if (!playerId) return;
    fetch(`${BACKEND}/api/player/${playerId}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(player =>
        dispatch({
          type: 'FETCH_PLAYER_SUCCESS',
          payload: { player }
        })
      )
      .catch(error => {
        props.showAlert('Could not load player data 😔', 'danger');
      });
  };

  const fetchPlayerStatsData = (playerId, season, game) => {
    if (!playerId) return;

    let url = `${BACKEND}/api/player/${playerId}/stats`;
    let eventType = 'FETCH_PLAYER_STATS_OVERALL_SUCCESS';

    if (!_.isNil(season)) {
      url += `/season/${season}`;
      eventType = 'FETCH_PLAYER_STATS_BY_SEASON_SUCCESS';
    } else if (!_.isNil(game)) {
      url += `/game/${game}`;
      eventType = 'FETCH_PLAYER_STATS_BY_GAME_SUCCESS';
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
      .then(playerStatsOverall =>
        dispatch({
          type: 'FETCH_PLAYER_STATS_OVERALL_SUCCESS',
          payload: { playerStatsOverall }
        })
      )
      .catch(error => {
        props.showAlert('Could not load player stats data 😔', 'danger');
      });
  };

  const onPlayerSelect = (playerId, playerName) => {
    dispatch({
      type: 'FETCH_PLAYER_REQUEST',
      payload: {
        playerId,
        playerName
      }
    });
  };

  const onTabClick = (_, tabIndex) => {
    dispatch({
      type: 'TAB_CHANGE',
      payload: { tabIndex }
    });
  };

  const photo = _.get(data.sportsDbData, 'strThumb') ? (
    <Bullseye>
      <Avatar src={data.sportsDbData.strThumb} color="#ecedec" size="250px" round />
    </Bullseye>
  ) : (
    <Bullseye>
      <Avatar value="Player" color="#ecedec" size="250px" round />
    </Bullseye>
  );

  const tabPlaceholder = (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h5" size="lg">
            No Player Selected
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
          <Title size="lg">Loading Player Stats.</Title>
        </EmptyState>
      </CardBody>
    </Card>
  );

  const charts = (expanded, playerData, onToggle) => (
    <Accordion asDefinitionList noBoxShadow>
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle('attempts-vs-made');
          }}
          isExpanded={expanded === 'attempts-vs-made'}
          id="attempts-vs-made"
        >
          Attempts vs. Made
        </AccordionToggle>
        <AccordionContent id="ex-expand1" isHidden={expanded !== 'attempts-vs-made'}>
          <AttemptsVsMadeChart data={playerData} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle('placeholder-one');
          }}
          isExpanded={expanded === 'placeholder-one'}
          id="placeholder-one"
        >
          Placeholder 1
        </AccordionToggle>
        <AccordionContent id="placeholder-one" isHidden={expanded !== 'placeholder-one'}>
          <PlaceholderChart />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle('placeholder-two');
          }}
          isExpanded={expanded === 'placeholder-two'}
          id="placeholder-two"
        >
          Placeholder 2
        </AccordionToggle>
        <AccordionContent id="placeholder-two" isHidden={expanded !== 'placeholder-two'}>
          <PlaceholderChart />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  const onToggle = (type, value) => {
    dispatch({
      type,
      payload: { value }
    });
  };

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>Player Analysis</Text>
          <Text component="p">Search for an NBA player and explore his stats.</Text>
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
                        <PlayerSearch
                          onPlayerSelect={onPlayerSelect}
                          onError={error => props.showAlert(error, 'danger')}
                          width="100%"
                        />
                      </StackItem>
                      <StackItem isFilled>
                        <TextContent>
                          <TextList component="dl">
                            <TextListItem component="dt">Player ID</TextListItem>
                            <TextListItem component="dd">{_.get(data.playerData, 'id', '')}</TextListItem>
                            <TextListItem component="dt">Favorite</TextListItem>
                            <TextListItem component="dd">
                              {_.has(data.playerData, 'isFavorite') ? (
                                <Switch
                                  id="player-details-is-favorite"
                                  isChecked={_.get(data.playerData, 'isFavorite', false)}
                                  // onChange={() => props.toggleFavorite(props.player.id, props.player.isFavorite)}
                                />
                              ) : (
                                ''
                              )}
                            </TextListItem>
                            <TextListItem component="dt">Birthdate</TextListItem>
                            <TextListItem component="dd">
                              {_.has(data.playerData, 'birthDate')
                                ? moment(data.playerData.birthDate).format('ll')
                                : ''}
                            </TextListItem>
                            <TextListItem component="dt">Position</TextListItem>
                            <TextListItem component="dd">{_.get(data.playerData, 'position', '')}</TextListItem>
                            <TextListItem component="dt">Height</TextListItem>
                            <TextListItem component="dd">
                              {_.has(data.playerData, 'height')
                                ? `${data.playerData.height.split('-')[0]}' ${data.playerData.height.split('-')[1]}"`
                                : ''}
                            </TextListItem>
                            <TextListItem component="dt">Weight</TextListItem>
                            <TextListItem component="dd">
                              {_.has(data.playerData, 'weight') ? `${data.playerData.weight} lbs` : ''}
                            </TextListItem>
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
            <Tabs mountOnEnter activeKey={data.activeTabKey} onSelect={onTabClick}>
              <Tab eventKey={0} title="Overall">
                {data.loading.playerStatsOverall
                  ? loadingPlaceholder
                  : _.isEmpty(data.playerStatsOverall)
                  ? tabPlaceholder
                  : charts(data.expanded.overall, data.playerStatsOverall, val =>
                      onToggle('CHART_CHANGE_OVERALL', val)
                    )}
              </Tab>
              <Tab eventKey={1} title="By Season">
                {data.loading.playerStatsBySeason
                  ? loadingPlaceholder
                  : _.isEmpty(data.playerStatsBySeason)
                  ? tabPlaceholder
                  : charts(data.expanded.season, data.playerStatsBySeason, val => onToggle('CHART_CHANGE_SEASON', val))}
              </Tab>
              <Tab eventKey={2} title="By Game">
                {data.loading.playerStatsByGame
                  ? loadingPlaceholder
                  : _.isEmpty(data.playerStatsByGame)
                  ? tabPlaceholder
                  : charts(data.expanded.game, data.playerStatsByGame, val => onToggle('CHART_CHANGE_GAME', val))}
              </Tab>
            </Tabs>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default PlayerAnalysis;
