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
import FranchiseSearch from '../FranchiseSearch';
import FieldGoalsComparisonAreaChart from '../../charts/FieldGoalsComparisonAreaChart';
import FieldGoalsComparisonChart from '../../charts/FieldGoalsComparisonChart';
import ThreePointersComparisonAreaChart from '../../charts/ThreePointersComparisonAreaChart';
import ThreePointersComparisonChart from '../../charts/ThreePointersComparisonChart';
import FreeThrowsComparisonAreaChart from '../../charts/FreeThrowsComparisonAreaChart';
import FreeThrowsComparisonChart from '../../charts/FreeThrowsComparisonChart';
import GeneralStatsComparisonAreaChart from '../../charts/GeneralStatsComparisonAreaChart';
import GeneralStatsComparisonChart from '../../charts/GeneralStatsComparisonChart';

const initialState = {
  franchiseData1: {},
  franchiseData2: {},
  sportDbLoading1: false,
  sportDbLoading2: false,
  sportDbError1: false,
  sportDbError2: false,
  loadingFranchise1: false,
  loadingFranchise2: false,
  errorFranchise1: null,
  errorFranchise2: null,
  sportDbData1: {},
  sportDbData2: {},
  activeTabKey: 0,
  loadingStatsFranchise1: false,
  loadingStatsFranchise2: false,
  statsFranchise1: {},
  statsFranchise2: {},
  seasonSelectIsExpanded: false,
  selectedSeasons: [],
  expanded: 'field-goals'
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
    case 'SELECT_FRANCHISE_1':
      return {
        ...state,
        franchiseData1: action.payload.franchise
      };
    case 'SELECT_FRANCHISE_2':
      return {
        ...state,
        franchiseData2: action.payload.franchise
      };
    case 'FETCH_SPORTSDB_FRANCHISE_1_REQUEST':
      return {
        ...state,
        loadingFranchise1: true
      };
    case 'FETCH_SPORTSDB_FRANCHISE_2_REQUEST':
      return {
        ...state,
        loadingFranchise2: true
      };
    case 'FETCH_SPORTSDB_FRANCHISE_1_SUCCESS':
      return {
        ...state,
        loadingFranchise1: false,
        sportDbData1: action.payload.franchise
      };
    case 'FETCH_SPORTSDB_FRANCHISE_2_SUCCESS':
      return {
        ...state,
        loadingFranchise2: false,
        sportDbData2: action.payload.franchise
      };
    case 'FAVORITE_TOGGLED_1':
      return {
        ...state,
        franchiseData1: {
          ...state.franchiseData1,
          isFavorite: action.payload.isFavorite
        }
      };
    case 'FAVORITE_TOGGLED_2':
      return {
        ...state,
        franchiseData2: {
          ...state.franchiseData2,
          isFavorite: action.payload.isFavorite
        }
      };
    case 'FETCH_FRANCHISE_1_STATS_LOADING':
      return {
        ...state,
        loadingStatsFranchise1: true
      };
    case 'FETCH_FRANCHISE_2_STATS_LOADING':
      return {
        ...state,
        loadingStatsFranchise2: true
      };
    case 'FETCH_FRANCHISE_1_STATS_SUCCESS':
      return {
        ...state,
        loadingStatsFranchise1: false,
        statsFranchise1: action.payload.stats
      };
    case 'FETCH_FRANCHISE_2_STATS_SUCCESS':
      return {
        ...state,
        loadingStatsFranchise2: false,
        statsFranchise2: action.payload.stats
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
const FranchiseComparison = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (_.isEmpty(data.franchiseData1)) return;
    fetchFranchiseData(1, `${_.get(data.franchiseData1, 'city')} ${_.get(data.franchiseData1, 'nickname')}`);
    fetchFranchiseStatsData(1, `${_.get(data.franchiseData1, 'id')}`);
  }, [data.franchiseData1]);

  React.useEffect(() => {
    if (_.isEmpty(data.franchiseData2)) return;
    fetchFranchiseData(2, `${_.get(data.franchiseData2, 'city')} ${_.get(data.franchiseData2, 'nickname')}`);
    fetchFranchiseStatsData(2, `${_.get(data.franchiseData2, 'id')}`);
  }, [data.franchiseData2]);

  const fetchFranchiseData = (number, franchiseName) => {
    if (_.isNil(franchiseName)) return;
    dispatch({ type: `FETCH_FRANCHISE_${number}_REQUEST` });
    return fetch(`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${franchiseName}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises =>
        dispatch({
          type: `FETCH_SPORTSDB_FRANCHISE_${number}_SUCCESS`,
          payload: {
            franchise: _.head(franchises.teams)
          }
        })
      )
      .catch(error => {
        props.showAlert('Could not load franchise data 😔', 'danger');
      });
  };

  const fetchFranchiseStatsData = (pos, franchiseId) => {
    if (!franchiseId) return;

    dispatch({
      type: `FETCH_FRANCHISE_${pos}_STATS_LOADING`
    });

    fetch(`${BACKEND}/api/franchise/${franchiseId}/stats/season`, {
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
          type: `FETCH_FRANCHISE_${pos}_STATS_SUCCESS`,
          payload: { stats }
        })
      )
      .catch(error => {
        props.showAlert('Could not load franchise stats data 😔', 'danger');
      });
  };

  const onFranchiseSelect = (pos, franchise) => {
    dispatch({
      type: `SELECT_FRANCHISE_${pos}`,
      payload: {
        franchise
      }
    });
  };

  const photo = pos => (
    <Bullseye>
      <Avatar src={_.get(data, `sportDbData${pos}.strTeamBadge`)} color="#ecedec" size="250px" />
    </Bullseye>
  );

  const franchiseDataRows = [
    {
      cells: [
        _.has(data.franchiseData1, 'isFavorite') ? (
          <React.Fragment>
            <Button variant="plain" aria-label="Favorite" onClick={() => onToggleFavorite(data.franchiseData1, 1)}>
              {data.franchiseData1.isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        ),
        'Favorite',
        _.has(data.franchiseData2, 'isFavorite') ? (
          <React.Fragment>
            <Button variant="plain" aria-label="Favorite" onClick={() => onToggleFavorite(data.franchiseData2, 2)}>
              {data.franchiseData2.isFavorite ? <StarIcon /> : <OutlinedStarIcon />}
            </Button>
          </React.Fragment>
        ) : (
          ''
        )
      ]
    },
    {
      cells: [
        _.get(data.franchiseData1, 'abbreviation', ''),
        'Abbreviation',
        _.get(data.franchiseData2, 'abbreviation', '')
      ]
    },
    {
      cells: [
        _.get(data.franchiseData1, 'yearFounded', ''),
        'Year Founded',
        _.get(data.franchiseData2, 'yearFounded', '')
      ]
    },
    {
      cells: [_.get(data.franchiseData1, 'city', ''), 'City', _.get(data.franchiseData2, 'city', '')]
    },
    {
      cells: [_.get(data.franchiseData1, 'arena', ''), 'Arena', _.get(data.franchiseData2, 'arena', '')]
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
            type: `FAVORITE_TOGGLED_${pos}`,
            payload: { isFavorite: !franchise.isFavorite }
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
          <Title size="lg">{text ? text : 'Loading Franchise Stats.'}</Title>
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
            {text ? text : 'No Franchise Selected.'}
          </Title>
        </EmptyState>
      </CardBody>
    </Card>
  );

  const seasons = _.sortBy(
    _.uniq(
      _.concat(
        _.map(data.statsFranchise1, seasonStats => seasonStats.season),
        _.map(data.statsFranchise2, seasonStats => seasonStats.season)
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
    const statsFranchise1 = filterBySelectedSeason(data.statsFranchise1);
    const statsFranchise2 = filterBySelectedSeason(data.statsFranchise2);
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
              {(!_.isArray(statsFranchise1) || _.isEmpty(statsFranchise1)) &&
              (!_.isArray(statsFranchise2) || _.isEmpty(statsFranchise2)) ? (
                <FieldGoalsComparisonChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
                />
              ) : (
                <FieldGoalsComparisonAreaChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
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
              {(!_.isArray(statsFranchise1) || _.isEmpty(statsFranchise1)) &&
              (!_.isArray(statsFranchise2) || _.isEmpty(statsFranchise2)) ? (
                <ThreePointersComparisonChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
                />
              ) : (
                <ThreePointersComparisonAreaChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
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
              {(!_.isArray(statsFranchise1) || _.isEmpty(statsFranchise1)) &&
              (!_.isArray(statsFranchise2) || _.isEmpty(statsFranchise2)) ? (
                <FreeThrowsComparisonChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
                />
              ) : (
                <FreeThrowsComparisonAreaChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
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
              {(!_.isArray(statsFranchise1) || _.isEmpty(statsFranchise1)) &&
              (!_.isArray(statsFranchise2) || _.isEmpty(statsFranchise2)) ? (
                <GeneralStatsComparisonChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
                />
              ) : (
                <GeneralStatsComparisonAreaChart
                  opponentData1={statsFranchise1}
                  opponentData2={statsFranchise2}
                  opponentName1={_.trim(
                    `${_.get(data.franchiseData1, 'city', '')} ${_.get(data.franchiseData1, 'nickname', '')}`
                  )}
                  opponentName2={_.trim(
                    `${_.get(data.franchiseData2, 'city', '')} ${_.get(data.franchiseData2, 'nickname', '')}`
                  )}
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
          <Text component="h1">Franchises</Text>
          <Text component="p">Choose two franchises and compare their stats.</Text>
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
                      <FranchiseSearch
                        onFranchiseSelect={franchise => onFranchiseSelect(1, franchise)}
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
                      <FranchiseSearch
                        onFranchiseSelect={franchise => onFranchiseSelect(2, franchise)}
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
              <CardBody style={{ padding: 0 }}>
                {data.loadingStatsFranchise1 || data.loadingStatsFranchise2 ? (
                  loadingPlaceholder()
                ) : !_.isEmpty(data.statsFranchise1) || !_.isEmpty(data.statsFranchise1) ? (
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

export default FranchiseComparison;
