import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartAxis, ChartBar, ChartGroup, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Three Pointers Comparison Chart',
  ariaTitle: 'Three Pointers Comparison Chart'
};

const ThreePointersComparisonChart = props => {
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
        domainPadding={{ x: 120 }}
        legendData={[{ name: _.get(props, 'opponentName1', 'N/A') }, { name: _.get(props, 'opponentName2', 'N/A') }]}
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
        <ChartGroup offset={35}>
          <ChartBar
            barWidth={30}
            data={[
              {
                name: _.get(props, 'opponentName1', 'N/A'),
                x: 'Three Pointers Made',
                y: _.get(props, 'opponentData1.threePointersMade', 0)
              },
              {
                name: _.get(props, 'opponentName1', 'N/A'),
                x: 'Three Pointers Attempted',
                y: _.get(props, 'opponentData1.threePointersAttempted', 0)
              }
            ]}
          />
          <ChartBar
            barWidth={30}
            data={[
              {
                name: _.get(props, 'opponentName2', 'N/A'),
                x: 'Three Pointers Made',
                y: _.get(props, 'opponentData2.threePointersMade', 0)
              },
              {
                name: _.get(props, 'opponentName2', 'N/A'),
                x: 'Three Pointers Attempted',
                y: _.get(props, 'opponentData2.threePointersAttempted', 0)
              }
            ]}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default ThreePointersComparisonChart;
