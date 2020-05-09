import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartAxis, ChartBar, ChartStack, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Attempts vs. Made Chart',
  ariaTitle: 'Attempts vs. Made Chart'
};

const LEGEND = [{ name: 'Attempted' }, { name: 'Made' }];

const AttemptsVsMadeChart = props => {
  let ref = React.useRef(null);
  let size = useComponentSize(ref);
  let { width } = size;

  return (
    <div ref={ref} style={{ height: '250px' }}>
      <Chart
        ariaDesc={METADATA.ariaDescription}
        ariaTitle={METADATA.ariaTitle}
        containerComponent={
          <ChartVoronoiContainer
            labels={({ datum }) => `${datum.name}: ${numbro(datum.value).format({ thousandSeparated: true })}`}
            constrainToVisibleArea
          />
        }
        domainPadding={{ x: 120 }}
        legendData={LEGEND}
        legendOrientation="vertical"
        legendPosition="right"
        height={225}
        padding={{
          bottom: 50,
          left: 150,
          right: 200, // Adjusted to accommodate legend
          top: 50
        }}
        width={width}
      >
        <ChartAxis />
        <ChartAxis dependentAxis showGrid />
        <ChartStack>
          <ChartBar
            barWidth={60}
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
            barWidth={60}
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
    </div>
  );
};

export default AttemptsVsMadeChart;
