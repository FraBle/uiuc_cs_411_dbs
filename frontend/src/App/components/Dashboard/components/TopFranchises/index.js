import React from 'react';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
  Select,
  SelectDirection,
  SelectOption,
  SelectVariant,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { BasketballBallIcon, CalendarIcon, ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';
import Avatar from 'react-avatar';
import numbro from 'numbro';
import _ from 'lodash';
import { AuthContext } from '../../../../Auth';

const initialState = {
  franchisePhoto: null,
  seasonSelected: 'Overall',
  seasonExpanded: false,
  categorySelected: 'Field Goals Made',
  categoryExpanded: false,
  loading: false,
  franchises: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: true
      };
    case 'SEASON_EXPANDED':
      return {
        ...state,
        seasonExpanded: action.payload.isExpanded
      };
    case 'SEASON_SELECTED':
      return {
        ...state,
        seasonSelected: action.payload.seasonSelected,
        seasonExpanded: false
      };
    case 'CATEGORY_EXPANDED':
      return {
        ...state,
        categoryExpanded: action.payload.isExpanded
      };
    case 'CATEGORY_SELECTED':
      return {
        ...state,
        categorySelected: action.payload.categorySelected,
        categoryExpanded: false
      };
    case 'UPDATE_FRANCHISE_LIST':
      return {
        ...state,
        franchises: action.payload.franchises
      };
    case 'UPDATE_FRANCHISE_PHOTO':
      return {
        ...state,
        franchisePhoto: action.payload.franchisePhoto,
        loading: false
      };
    default:
      return state;
  }
};

const TopFranchises = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);
  const history = useHistory();

  React.useEffect(() => {
    fetchTopFranchiseData();
  }, [data.seasonSelected, data.categorySelected]);

  const fetchTopFranchiseData = () => {
    dispatch({ type: 'LOADING' });
    let url = `${BACKEND}/api/franchise/stats/top`;
    if (!_.eq(data.seasonSelected, 'Overall')) url += `/season/${data.seasonSelected}`;

    return fetch(url + `?topN=10&sortType=${_.join(_.split(data.categorySelected, ' '), '')}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises => {
        dispatch({
          type: 'UPDATE_FRANCHISE_LIST',
          payload: { franchises }
        });
        return franchises;
      })
      .then(franchises =>
        fetch(
          `https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${_.get(_.head(franchises), 'franchiseName')}`
        )
      )
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises =>
        dispatch({
          type: 'UPDATE_FRANCHISE_PHOTO',
          payload: {
            franchisePhoto: _.get(_.head(franchises.teams), 'strTeamBadge')
          }
        })
      )
      .catch(error => {
        props.showAlert('Could not load franchise data 😔', 'danger');
      });
  };

  const onSeasonToggle = isExpanded => {
    dispatch({
      type: 'SEASON_EXPANDED',
      payload: { isExpanded }
    });
  };

  const onSeasonSelect = (event, selection, isPlaceholder) => {
    dispatch({
      type: 'SEASON_SELECTED',
      payload: {
        seasonSelected: selection
      }
    });
  };

  const onCategoryToggle = isExpanded => {
    dispatch({
      type: 'CATEGORY_EXPANDED',
      payload: { isExpanded }
    });
  };

  const onCategorySelect = (event, selection, isPlaceholder) => {
    dispatch({
      type: 'CATEGORY_SELECTED',
      payload: {
        categorySelected: selection
      }
    });
  };

  const onFranchiseClick = franchiseId => {
    if (franchiseId) {
      history.push(`/dashboard/analysis/franchise?id=${franchiseId}`);
    }
  };

  const photo =
    !_.isNil(data.franchisePhoto) && !data.loading ? (
      <Bullseye>
        <Avatar src={data.franchisePhoto} color="#ecedec" size="250px" />
      </Bullseye>
    ) : (
      <Bullseye>
        <Avatar value="Franchise" color="#ecedec" size="250px" round />
      </Bullseye>
    );

  const empty = (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.xl}>
        <EmptyStateIcon icon={BasketballBallIcon} />
        <Title headingLevel="h5" size="4xl">
          Nothing to show (yet).
        </Title>
      </EmptyState>
    </Bullseye>
  );

  const loading = (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.xl}>
        <EmptyStateIcon variant="container" component={Spinner} />
        <Title headingLevel="h5" size="4xl">
          Loading...
        </Title>
      </EmptyState>
    </Bullseye>
  );

  const rows = _.map(data.franchises, (franchise, i) => ({
    cells: [
      i + 1,
      {
        title: (
          <Button
            variant="link"
            isInline
            icon={<ExternalLinkSquareAltIcon />}
            iconPosition="right"
            onClick={() => onFranchiseClick(franchise.franchise)}
          >
            {franchise.franchiseName}
          </Button>
        )
      },
      numbro(_.get(franchise, _.camelCase(data.categorySelected))).format({ thousandSeparated: true })
    ]
  }));

  const table = (
    <Table aria-label="Franchise Table" cells={['#', 'Franchise', 'Result']} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );

  const categories = [
    'Field Goals Made',
    'Field Goals Attempted',
    'Three Pointers Made',
    'Three Pointers Attempted',
    'Free Throws Made',
    'Free Throws Attempted',
    'Offensive Rebounds',
    'Defensive Rebounds',
    'Points',
    'Assists',
    'Steals',
    'Blocks',
    'Turnovers',
    'Personal Fouls'
  ];

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>Top: Franchises</Text>
          <Text component={TextVariants.p}>Search for the best franchises in the NBA!</Text>
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
                      <StackItem>
                        <Title headingLevel="h3" size="2xl">
                          Season:
                        </Title>
                      </StackItem>
                      <StackItem>
                        <Select
                          toggleIcon={<CalendarIcon />}
                          variant={SelectVariant.single}
                          aria-label="Select Season"
                          onToggle={onSeasonToggle}
                          onSelect={onSeasonSelect}
                          selections={data.seasonSelected}
                          isExpanded={data.seasonExpanded}
                          ariaLabelledBy="season-title-id"
                          direction={SelectDirection.down}
                        >
                          {_.concat(
                            [<SelectOption key="season-overall" value="Overall" />],
                            _.map(_.range(2003, 2020), (season, index) => (
                              <SelectOption key={`season-${index}`} value={_.toString(season)} />
                            ))
                          )}
                        </Select>
                      </StackItem>
                      <StackItem>
                        <Title headingLevel="h3" size="2xl">
                          Category:
                        </Title>
                      </StackItem>
                      <StackItem>
                        <Select
                          toggleIcon={<BasketballBallIcon />}
                          variant={SelectVariant.single}
                          aria-label="Select Category"
                          onToggle={onCategoryToggle}
                          onSelect={onCategorySelect}
                          selections={data.categorySelected}
                          isExpanded={data.categoryExpanded}
                          ariaLabelledBy="category-title-id"
                          direction={SelectDirection.down}
                        >
                          {_.map(categories, (category, index) => (
                            <SelectOption key={`category-${index}`} value={category} />
                          ))}
                        </Select>
                      </StackItem>
                    </Stack>
                  </CardBody>
                </Card>
              </SplitItem>
              <SplitItem>{photo}</SplitItem>
            </Split>
          </StackItem>
          <StackItem isFilled>
            <Card>
              <CardBody>{data.loading ? loading : _.isEmpty(data.franchises) ? empty : table}</CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default TopFranchises;
