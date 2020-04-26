import React from 'react';
import { Bullseye, Spinner, Title, EmptyState, EmptyStateIcon } from '@patternfly/react-core';
import { Chart, ChartAxis, ChartBar, ChartStack, ChartVoronoiContainer } from '@patternfly/react-charts';
import { AuthContext } from '../../../../Auth';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import numbro from 'numbro';

const TABLES = [
  'College',
  'FavoritesFranchise',
  'FavoritesPlayer',
  'Franchise',
  'Games',
  'Player',
  'PlayerGameStats',
  'User'
];

const METADATA = {
  ariaDescription: 'DB Size Chart',
  ariaTitle: 'DB Size Chart',
  subTitle: 'Entries'
};

const LEGEND = [{ name: 'Attempted' }, { name: 'Made' }];

const AttemptsVsMadeChart = props => {
  return (
    <Chart
      ariaDesc={METADATA.ariaDescription}
      ariaTitle={METADATA.ariaTitle}
      containerComponent={
        <ChartVoronoiContainer
          labels={({ datum }) => `${datum.name}: ${numbro(datum.value).format({ thousandSeparated: true })}`}
          constrainToVisibleArea
        />
      }
      domainPadding={{ x: [30, 25] }}
      legendData={LEGEND}
      legendOrientation="vertical"
      legendPosition="right"
      height={250}
      padding={{
        bottom: 50,
        left: 150,
        right: 200, // Adjusted to accommodate legend
        top: 50
      }}
      width={600}
    >
      <ChartAxis />
      <ChartAxis dependentAxis showGrid />
      <ChartStack>
        <ChartBar
          data={[
            {
              name: 'Made',
              x: 'Field Goals',
              y: _.get(props.data, 'fieldGoalsMade', 0),
              value: _.get(props.data, 'fieldGoalsMade', 0)
            },
            {
              name: 'Made',
              x: 'Three Pointers',
              y: _.get(props.data, 'threePointersMade', 0),
              value: _.get(props.data, 'threePointersMade', 0)
            },
            {
              name: 'Made',
              x: 'Free Throws',
              y: _.get(props.data, 'freeThrowsMade', 0),
              value: _.get(props.data, 'freeThrowsMade', 0)
            }
          ]}
        />
        <ChartBar
          data={[
            {
              name: 'Attempted',
              x: 'Field Goals',
              y: _.get(props.data, 'fieldGoalsAttempted', 0) - _.get(props.data, 'fieldGoalsMade', 0),
              value: _.get(props.data, 'fieldGoalsAttempted', 0)
            },
            {
              name: 'Attempted',
              x: 'Three Pointers',
              y: _.get(props.data, 'threePointersAttempted', 0) - _.get(props.data, 'threePointersMade', 0),
              value: _.get(props.data, 'threePointersAttempted', 0)
            },
            {
              name: 'Attempted',
              x: 'Free Throws',
              y: _.get(props.data, 'freeThrowsAttempted', 0) - _.get(props.data, 'freeThrowsMade', 0),
              value: _.get(props.data, 'freeThrowsAttempted', 0)
            }
          ]}
        />
      </ChartStack>
    </Chart>
  );
};

export default AttemptsVsMadeChart;
