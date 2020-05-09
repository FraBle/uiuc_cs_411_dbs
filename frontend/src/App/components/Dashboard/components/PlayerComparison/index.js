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
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Select,
  SelectOption,
  SelectVariant,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title
} from '@patternfly/react-core';

import { Table, cellWidth, TableBody, TableHeader, textCenter } from '@patternfly/react-table';
import { SearchIcon, StarIcon, OutlinedStarIcon } from '@patternfly/react-icons';
import { AuthContext } from '../../../../Auth';
import moment from 'moment';
import _ from 'lodash';
import Avatar from 'react-avatar';
import PlayerSearch from '../PlayerSearch';
import FieldGoalsComparisonAreaChart from '../../charts/FieldGoalsComparisonAreaChart';
import FieldGoalsComparisonChart from '../../charts/FieldGoalsComparisonChart';
import ThreePointersComparisonAreaChart from '../../charts/ThreePointersComparisonAreaChart';
import ThreePointersComparisonChart from '../../charts/ThreePointersComparisonChart';
import FreeThrowsComparisonAreaChart from '../../charts/FreeThrowsComparisonAreaChart';
import FreeThrowsComparisonChart from '../../charts/FreeThrowsComparisonChart';
import GeneralStatsComparisonAreaChart from '../../charts/GeneralStatsComparisonAreaChart';
import GeneralStatsComparisonChart from '../../charts/GeneralStatsComparisonChart';

const initialState = {
  selectedPlayer1: null,
  selectedPlayer2: null,
  playerData1: {},
  playerData2: {},
  sportDbLoading1: false,
  sportDbLoading2: false,
  sportDbError1: false,
  sportDbError2: false,
  loadingPlayer1: false,
  loadingPlayer2: false,
  errorPlayer1: null,
  errorPlayer2: null,
  sportDbData1: {},
  sportDbData2: {},
  activeTabKey: 0,
  loadingStatsPlayer1: false,
  loadingStatsPlayer2: false,
  statsPlayer1: {},
  statsPlayer2: {},
  seasonSelectIsExpanded: false,
  selectedSeasons: [],
  expanded: 'field-goals'
};

const playerDataColumns = [
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
    case 'SELECT_PLAYER_1':
      return {
        ...state,
        selectedPlayer1: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    case 'SELECT_PLAYER_2':
      return {
        ...state,
        selectedPlayer2: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    case 'FETCH_PLAYER_1_REQUEST':
      return {
        ...state,
        loadingPlayer1: true
      };
    case 'FETCH_PLAYER_2_REQUEST':
      return {
        ...state,
        loadingPlayer2: true
      };
    case 'FETCH_PLAYER_1_SUCCESS':
      return {
        ...state,
        playerData1: action.payload.player
      };
    case 'FETCH_PLAYER_2_SUCCESS':
      return {
        ...state,
        playerData2: action.payload.player
      };
    case 'FETCH_SPORTSDB_PLAYER_1_SUCCESS':
      return {
        ...state,
        loadingPlayer1: false,
        sportDbData1: action.payload.player
      };
    case 'FETCH_SPORTSDB_PLAYER_2_SUCCESS':
      return {
        ...state,
        loadingPlayer2: false,
        sportDbData2: action.payload.player
      };
    case 'FAVORITE_TOGGLED_1':
      return {
        ...state,
        playerData1: {
          ...state.playerData1,
          isFavorite: action.payload.isFavorite
        }
      };
    case 'FAVORITE_TOGGLED_2':
      return {
        ...state,
        playerData2: {
          ...state.playerData2,
          isFavorite: action.payload.isFavorite
        }
      };
    case 'FETCH_PLAYER_1_STATS_LOADING':
      return {
        ...state,
        loadingStatsPlayer1: true
      };
    case 'FETCH_PLAYER_2_STATS_LOADING':
      return {
        ...state,
        loadingStatsPlayer2: true
      };
    case 'FETCH_PLAYER_1_STATS_SUCCESS':
      return {
        ...state,
        loadingStatsPlayer1: false,
        statsPlayer1: action.payload.stats
      };
    case 'FETCH_PLAYER_2_STATS_SUCCESS':
      return {
        ...state,
        loadingStatsPlayer2: false,
        statsPlayer2: action.payload.stats
      };
    case 'TAB_CHANGE':
      return {
        ...state,
        activeTabKey: action.payload.tabIndex
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
    case 'CHART_CHANGE':
      return {
        ...state,
        expanded: action.payload.value
      };
    default:
      return state;
  }
};
const PlayerComparison = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    fetchPlayerData(1, data.selectedPlayer1);
    fetchPlayerStatsData(1, _.get(data.selectedPlayer1, 'id'));
  }, [data.selectedPlayer1]);

  React.useEffect(() => {
    fetchPlayerData(2, data.selectedPlayer2);
    fetchPlayerStatsData(2, _.get(data.selectedPlayer2, 'id'));
  }, [data.selectedPlayer2]);

  const fetchPlayerData = (number, player) => {
    if (_.isNil(player)) return;
    dispatch({ type: `FETCH_PLAYER_${number}_REQUEST` });
    return fetch(`${BACKEND}/api/player/${player.id}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(player => {
        dispatch({
          type: `FETCH_PLAYER_${number}_SUCCESS`,
          payload: { player }
        });
        return player;
      })
      .then(player => fetch(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=${_.get(player, 'name')}`))
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(players =>
        dispatch({
          type: `FETCH_SPORTSDB_PLAYER_${number}_SUCCESS`,
          payload: {
            player: _.head(players.player)
          }
        })
      )
      .catch(error => {
        props.showAlert('Could not load player data 😔', 'danger');
      });
  };

  const fetchPlayerStatsData = (pos, playerId) => {
    if (!playerId) return;

    dispatch({
      type: `FETCH_PLAYER_${pos}_STATS_LOADING`
    });

    fetch(`${BACKEND}/api/player/${playerId}/stats/season`, {
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
          type: `FETCH_PLAYER_${pos}_STATS_SUCCESS`,
          payload: { stats }
        })
      )
      .catch(error => {
        props.showAlert('Could not load player stats data 😔', 'danger');
      });
  };

  const onPlayerSelect = (pos, id, name) => {
    dispatch({
      type: `SELECT_PLAYER_${pos}`,
      payload: {
        id,
        name
      }
    });
  };

  const photo = pos => (
    <Bullseye>
      <Avatar src={_.get(data, `sportDbData${pos}.strThumb`)} color="#ecedec" size="250px" round />
    </Bullseye>
  );

  const playerDataRows = [
    {
      cells: [
        _.has(data.playerData1, 'isFavorite') ? (
          <React.Fragment>
            <Button variant="plain" aria-label="Favorite" onClick={() => onToggleFavorite(data.playerData1, 1)}>
              {data.playerData1.isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        ),
        'Favorite',
        _.has(data.playerData2, 'isFavorite') ? (
          <React.Fragment>
            <Button variant="plain" aria-label="Favorite" onClick={() => onToggleFavorite(data.playerData2, 2)}>
              {data.playerData2.isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        )
      ]
    },
    {
      cells: [
        _.has(data.playerData1, 'birthDate') ? moment.utc(data.playerData1.birthDate).format('ll') : '',
        'Birthdate',
        _.has(data.playerData2, 'birthDate') ? moment.utc(data.playerData2.birthDate).format('ll') : ''
      ]
    },
    {
      cells: [_.get(data.playerData1, 'position', ''), 'Position', _.get(data.playerData2, 'position', '')]
    },
    {
      cells: [
        _.has(data.playerData1, 'height')
          ? `${data.playerData1.height.split('-')[0]}' ${data.playerData1.height.split('-')[1]}"`
          : '',
        'Height',
        _.has(data.playerData2, 'birthDate')
          ? `${data.playerData2.height.split('-')[0]}' ${data.playerData2.height.split('-')[1]}"`
          : ''
      ]
    },
    {
      cells: [
        _.has(data.playerData1, 'weight') ? `${data.playerData1.weight} lbs` : '',
        'Weight',
        _.has(data.playerData2, 'birthDate') ? `${data.playerData2.weight} lbs` : ''
      ]
    }
  ];

  const onToggleFavorite = (player, pos) => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/player/${player.id}`, {
      method: player.isFavorite ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.ok)
          dispatch({
            type: `FAVORITE_TOGGLED_${pos}`,
            payload: { isFavorite: !player.isFavorite }
          });
        else props.showAlert("Ooops, looks like that didn't work 😔");
      })
      .catch(error => {
        props.showAlert("Ooops, looks like that didn't work 😔");
      });
  };

  const onToggle = (type, value) => {
    dispatch({
      type,
      payload: { value }
    });
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

  const filterBySelectedSeason = seasonData => {
    if (_.isEmpty(data.selectedSeasons)) return seasonData;
    const result = _.filter(seasonData, el => _.includes(data.selectedSeasons, _.toString(el.season)));
    if (_.eq(_.size(result), 1)) return _.head(result);
    return result;
  };
  const loadingPlaceholder = text => (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon variant="container" component={Spinner} />
          <Title size="lg">{text ? text : 'Loading Player Stats.'}</Title>
        </EmptyState>
      </CardBody>
    </Card>
  );

  const tabPlaceholder = text => (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h5" size="lg">
            {text ? text : 'No Player Selected.'}
          </Title>
        </EmptyState>
      </CardBody>
    </Card>
  );

  const seasons = _.sortBy(
    _.uniq(
      _.concat(
        _.map(data.statsPlayer1, seasonStats => seasonStats.season),
        _.map(data.statsPlayer2, seasonStats => seasonStats.season)
      )
    )
  );

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
          {_.map(seasons, season => (
            <SelectOption key={season} value={`${season}`} />
          ))}
        </Select>
      </CardBody>
    </Card>
  );

  const charts = () => {
    const statsPlayer1 = filterBySelectedSeason(data.statsPlayer1);
    const statsPlayer2 = filterBySelectedSeason(data.statsPlayer2);
    return (
      <React.Fragment>
        <Accordion asDefinitionList noBoxShadow>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('CHART_CHANGE', 'field-goals');
              }}
              isExpanded={data.expanded === 'field-goals'}
              id="field-goals"
            >
              Field Goals
            </AccordionToggle>
            <AccordionContent id="field-goals" isHidden={data.expanded !== 'field-goals'}>
              {(!_.isArray(statsPlayer1) || _.isEmpty(statsPlayer1)) &&
              (!_.isArray(statsPlayer2) || _.isEmpty(statsPlayer2)) ? (
                <FieldGoalsComparisonChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              ) : (
                <FieldGoalsComparisonAreaChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('CHART_CHANGE', 'three-pointers');
              }}
              isExpanded={data.expanded === 'three-pointers'}
              id="three-pointers"
            >
              Three Pointers
            </AccordionToggle>
            <AccordionContent id="three-pointers" isHidden={data.expanded !== 'three-pointers'}>
              {(!_.isArray(statsPlayer1) || _.isEmpty(statsPlayer1)) &&
              (!_.isArray(statsPlayer2) || _.isEmpty(statsPlayer2)) ? (
                <ThreePointersComparisonChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              ) : (
                <ThreePointersComparisonAreaChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('CHART_CHANGE', 'free-throws');
              }}
              isExpanded={data.expanded === 'free-throws'}
              id="free-throws"
            >
              Free Throws
            </AccordionToggle>
            <AccordionContent id="free-throws" isHidden={data.expanded !== 'free-throws'}>
              {(!_.isArray(statsPlayer1) || _.isEmpty(statsPlayer1)) &&
              (!_.isArray(statsPlayer2) || _.isEmpty(statsPlayer2)) ? (
                <FreeThrowsComparisonChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              ) : (
                <FreeThrowsComparisonAreaChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('CHART_CHANGE', 'general-stats');
              }}
              isExpanded={data.expanded === 'general-stats'}
              id="general-stats"
            >
              General Stats
            </AccordionToggle>
            <AccordionContent id="general-stats" isHidden={data.expanded !== 'general-stats'}>
              {(!_.isArray(statsPlayer1) || _.isEmpty(statsPlayer1)) &&
              (!_.isArray(statsPlayer2) || _.isEmpty(statsPlayer2)) ? (
                <GeneralStatsComparisonChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              ) : (
                <GeneralStatsComparisonAreaChart
                  opponentData1={statsPlayer1}
                  opponentData2={statsPlayer2}
                  opponentName1={_.get(data.selectedPlayer1, 'name', '')}
                  opponentName2={_.get(data.selectedPlayer2, 'name', '')}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Players</Text>
          <Text component="p">Choose two players and compare their stats.</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Stack gutter="md">
          <StackItem>
            <Card>
              <CardBody>
                <Grid gutter="md">
                  <GridItem span={5}>
                    <Bullseye>
                      <PlayerSearch
                        onPlayerSelect={(id, name) => onPlayerSelect(1, id, name)}
                        onError={error => props.showAlert(error, 'danger')}
                        width="100%"
                      />
                    </Bullseye>
                  </GridItem>
                  <GridItem span={2}>
                    <Bullseye>
                      <Text>vs.</Text>
                    </Bullseye>
                  </GridItem>
                  <GridItem span={5}>
                    <Bullseye>
                      <PlayerSearch
                        onPlayerSelect={(id, name) => onPlayerSelect(2, id, name)}
                        onError={error => props.showAlert(error, 'danger')}
                        width="100%"
                      />
                    </Bullseye>
                  </GridItem>
                  <GridItem span={5}>
                    <Bullseye>{photo(1)}</Bullseye>
                  </GridItem>
                  <GridItem span={2}></GridItem>
                  <GridItem span={5}>
                    <Bullseye>{photo(2)}</Bullseye>
                  </GridItem>
                  <GridItem span={12}>
                    <Bullseye>
                      <Table aria-label="Player Data" cells={playerDataColumns} rows={playerDataRows}>
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
              <CardBody style={{ padding: 0 }}>
                {data.loadingStatsPlayer1 || data.loadingStatsPlayer2 ? (
                  loadingPlaceholder()
                ) : !_.isEmpty(data.statsPlayer1) || !_.isEmpty(data.statsPlayer1) ? (
                  <React.Fragment>
                    {seasonSelect}
                    {charts()}
                  </React.Fragment>
                ) : (
                  tabPlaceholder()
                )}
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default PlayerComparison;
