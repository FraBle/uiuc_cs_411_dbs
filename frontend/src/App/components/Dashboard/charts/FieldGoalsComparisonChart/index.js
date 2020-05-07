import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartAxis, ChartBar, ChartGroup, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Field Goals Comparison Chart',
  ariaTitle: 'Field Goals Comparison Chart'
};

const FieldGoalsComparisonChart = props => {
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
            labels={({ datum }) => `${datum.name}: ${numbro(datum.y).format({ thousandSeparated: true })}`}
            constrainToVisibleArea
          />
        }
        domainPadding={{ x: [60, 60] }}
        legendData={[{ name: _.get(props, 'playerName1', 'N/A') }, { name: _.get(props, 'playerName2', 'N/A') }]}
        legendOrientation="vertical"
        legendPosition="right"
        height={225}
        padding={{
          bottom: 50,
          left: 150,
          right: 250,
          top: 50
        }}
        width={width}
      >
        <ChartAxis />
        <ChartAxis dependentAxis showGrid />
        <ChartGroup offset={11}>
          <ChartBar
            data={[
              {
                name: _.get(props, 'playerName1', 'N/A'),
                x: 'Field Goals Made',
                y: _.get(props, 'playerData1.fieldGoalsMade', 0)
              },
              {
                name: _.get(props, 'playerName1', 'N/A'),
                x: 'Field Goals Attempted',
                y: _.get(props, 'playerData1.fieldGoalsAttempted', 0)
              }
            ]}
          />
          <ChartBar
            data={[
              {
                name: _.get(props, 'playerName2', 'N/A'),
                x: 'Field Goals Made',
                y: _.get(props, 'playerData2.fieldGoalsMade', 0)
              },
              {
                name: _.get(props, 'playerName2', 'N/A'),
                x: 'Field Goals Attempted',
                y: _.get(props, 'playerData2.fieldGoalsAttempted', 0)
              }
            ]}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default FieldGoalsComparisonChart;
