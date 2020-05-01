import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Bullseye,
  Card,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Select,
  SelectOption,
  SelectVariant,
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
import AttemptsVsMadeAreaChart from '../../charts/AttemptsVsMadeAreaChart';
import ReboundsChart from '../../charts/ReboundsChart';
import ReboundsAreaChart from '../../charts/ReboundsAreaChart';
import PointsVsAssistsChart from '../../charts/PointsVsAssistsChart';
import PointsVsAssistsAreaChart from '../../charts/PointsVsAssistsAreaChart';
import GeneralStatsChart from '../../charts/GeneralStatsChart';
import GeneralStatsAreaChart from '../../charts/GeneralStatsAreaChart';

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
  selectedGame: null,
  sportsDbData: {},
  activeTabKey: 0,
  activeSeasonTabKey: 0,
  seasonSelectIsExpanded: false,
  selectedSeasons: []
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
        playerData: {},
        playerStatsOverall: {},
        playerStatsBySeason: {},
        playerStatsByGame: {},
        selectedSeasons: [],
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
        playerStatsOverall: action.payload.stats
      };
    case 'FETCH_PLAYER_STATS_BY_SEASON_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          playerStatsBySeason: true
        }
      };
    case 'FETCH_PLAYER_STATS_BY_SEASON_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          playerStatsBySeason: false
        },
        playerStatsBySeason: action.payload.stats
      };
    case 'FETCH_PLAYER_STATS_BY_GAME_SUCCESS':
      return {
        ...state,
        loading: {
          ...state.loading,
          playerStatsByGame: false
        },
        playerStatsByGame: action.payload.stats
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
    case 'SEASON_SELECT_CLEAR':
      return {
        ...state,
        selectedSeasons: [],
        seasonSelectIsExpanded: false
      };
    case 'FAVORITE_TOGGLED':
      return {
        ...state,
        playerData: {
          ...state.playerData,
          isFavorite: !state.playerData.isFavorite
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
      fetchTabData()
    ]);
  }, [data.selectedPlayer]);

  React.useEffect(() => {
    if (_.isEmpty(data.selectedPlayer)) return;
    fetchTabData();
  }, [data.activeTabKey]);

  const fetchTabData = () => {
    switch (data.activeTabKey) {
      case 0:
        if (_.isEmpty(data.playerStatsOverall)) {
          fetchPlayerStatsData(_.get(data.selectedPlayer, 'id'));
        }
        break;
      case 1:
        if (_.isEmpty(data.playerStatsBySeason)) {
          dispatch({ type: 'FETCH_PLAYER_STATS_BY_SEASON_REQUEST' });
          fetchPlayerStatsData(_.get(data.selectedPlayer, 'id'), true);
        }
        break;
    }
  };

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

  const fetchPlayerStatsData = (playerId, bySeason, game) => {
    if (!playerId) return;

    let url = `${BACKEND}/api/player/${playerId}/stats`;
    let eventType = 'FETCH_PLAYER_STATS_OVERALL_SUCCESS';

    if (bySeason) {
      url += `/season`;
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
      .then(stats =>
        dispatch({
          type: eventType,
          payload: { stats }
        })
      )
      .catch(error => {
        props.showAlert('Could not load player stats data 😔', 'danger');
      });
  };

  const onToggleFavorite = player => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/player/${player.id}`, {
      method: player.isFavorite ? 'DELETE' : 'PUT',
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
          {_.map(data.playerStatsBySeason, el => (
            <SelectOption key={el.season} value={`${el.season}`} />
          ))}
        </Select>
      </CardBody>
    </Card>
  );

  const charts = (expanded, playerData, onToggle, tab) => (
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
            {_.isArray(playerData) ? (
              <AttemptsVsMadeAreaChart data={playerData} />
            ) : (
              <AttemptsVsMadeChart data={playerData} />
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
            {_.isArray(playerData) ? <ReboundsAreaChart data={playerData} /> : <ReboundsChart data={playerData} />}
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
            {_.isArray(playerData) ? (
              <PointsVsAssistsAreaChart data={playerData} />
            ) : (
              <PointsVsAssistsChart data={playerData} />
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
            {_.isArray(playerData) ? (
              <GeneralStatsAreaChart data={playerData} />
            ) : (
              <GeneralStatsChart data={playerData} />
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
                                  onChange={() => onToggleFavorite(data.playerData)}
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
            <Card>
              <CardBody style={{ padding: 0 }}>
                <Tabs isFilled mountOnEnter activeKey={data.activeTabKey} onSelect={onTabClick}>
                  <Tab eventKey={0} title="Overall">
                    {data.loading.playerStatsOverall
                      ? loadingPlaceholder
                      : _.isEmpty(data.playerStatsOverall)
                      ? tabPlaceholder
                      : charts(data.expanded.overall, data.playerStatsOverall, onToggle, 'overall')}
                  </Tab>
                  <Tab eventKey={1} title="By Season">
                    {data.loading.playerStatsBySeason ? (
                      loadingPlaceholder
                    ) : _.isEmpty(data.playerStatsBySeason) ? (
                      tabPlaceholder
                    ) : (
                      <React.Fragment>
                        {seasonSelect}
                        {charts(
                          data.expanded.season,
                          filterBySelectedSeason(data.playerStatsBySeason),
                          onToggle,
                          'bySeason'
                        )}
                      </React.Fragment>
                    )}
                  </Tab>
                  <Tab eventKey={2} title="By Game">
                    {data.loading.playerStatsByGame
                      ? loadingPlaceholder
                      : _.isEmpty(data.playerStatsByGame)
                      ? tabPlaceholder
                      : charts(data.expanded.game, data.playerStatsByGame, onToggle, 'byGame')}
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

export default PlayerAnalysis;
