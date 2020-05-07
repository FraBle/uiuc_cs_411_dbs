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
                x: 'Assists',
                y: _.get(props, 'playerData1.assists', 0)
              },
              {
                name: _.get(props, 'playerName1', 'N/A'),
                x: 'Steals',
                y: _.get(props, 'playerData1.steals', 0)
              },
              {
                name: _.get(props, 'playerName1', 'N/A'),
                x: 'Blocks',
                y: _.get(props, 'playerData1.blocks', 0)
              },
              {
                name: _.get(props, 'playerName1', 'N/A'),
                x: 'Turnovers',
                y: _.get(props, 'playerData1.turnovers', 0)
              },
              {
                name: _.get(props, 'playerName1', 'N/A'),
                x: 'Fouls',
                y: _.get(props, 'playerData1.personalFouls', 0)
              }
            ]}
          />
          <ChartBar
            data={[
              {
                name: _.get(props, 'playerName2', 'N/A'),
                x: 'Assists',
                y: _.get(props, 'playerData2.assists', 0)
              },
              {
                name: _.get(props, 'playerName2', 'N/A'),
                x: 'Steals',
                y: _.get(props, 'playerData2.blocks', 0)
              },
              {
                name: _.get(props, 'playerName2', 'N/A'),
                x: 'Blocks',
                y: _.get(props, 'playerData2.threePointersAttempted', 0)
              },
              {
                name: _.get(props, 'playerName2', 'N/A'),
                x: 'Turnovers',
                y: _.get(props, 'playerData2.turnovers', 0)
              },
              {
                name: _.get(props, 'playerName2', 'N/A'),
                x: 'Fouls',
                y: _.get(props, 'playerData2.personalFouls', 0)
              }
            ]}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default ThreePointersComparisonChart;
