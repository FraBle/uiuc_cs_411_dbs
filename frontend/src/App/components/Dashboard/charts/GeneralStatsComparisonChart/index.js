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
        domainPadding={{ x: 60 }}
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
                x: 'Assists',
                y: _.get(props, 'opponentData1.assists', 0)
              },
              {
                name: _.get(props, 'opponentName1', 'N/A'),
                x: 'Steals',
                y: _.get(props, 'opponentData1.steals', 0)
              },
              {
                name: _.get(props, 'opponentName1', 'N/A'),
                x: 'Blocks',
                y: _.get(props, 'opponentData1.blocks', 0)
              },
              {
                name: _.get(props, 'opponentName1', 'N/A'),
                x: 'Turnovers',
                y: _.get(props, 'opponentData1.turnovers', 0)
              },
              {
                name: _.get(props, 'opponentName1', 'N/A'),
                x: 'Fouls',
                y: _.get(props, 'opponentData1.personalFouls', 0)
              }
            ]}
          />
          <ChartBar
            barWidth={30}
            data={[
              {
                name: _.get(props, 'opponentName2', 'N/A'),
                x: 'Assists',
                y: _.get(props, 'opponentData2.assists', 0)
              },
              {
                name: _.get(props, 'opponentName2', 'N/A'),
                x: 'Steals',
                y: _.get(props, 'opponentData2.blocks', 0)
              },
              {
                name: _.get(props, 'opponentName2', 'N/A'),
                x: 'Blocks',
                y: _.get(props, 'opponentData2.threePointersAttempted', 0)
              },
              {
                name: _.get(props, 'opponentName2', 'N/A'),
                x: 'Turnovers',
                y: _.get(props, 'opponentData2.turnovers', 0)
              },
              {
                name: _.get(props, 'opponentName2', 'N/A'),
                x: 'Fouls',
                y: _.get(props, 'opponentData2.personalFouls', 0)
              }
            ]}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default ThreePointersComparisonChart;
