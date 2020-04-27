import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartAxis, ChartBar, ChartGroup, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'General Stats Chart',
  ariaTitle: 'General Stats Chart'
};

const GeneralStatsChart = props => {
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
            labels={({ datum }) => `${datum.x}: ${numbro(datum.y).format({ thousandSeparated: true })}`}
            constrainToVisibleArea
          />
        }
        domainPadding={{ x: [30, 25] }}
        height={225}
        padding={{
          bottom: 50,
          left: 150,
          right: 150,
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
                x: 'Steals',
                y: _.get(props.data, 'steals', 0)
              },
              {
                x: 'Blocks',
                y: _.get(props.data, 'blocks', 0)
              },
              {
                x: 'Turnovers',
                y: _.get(props.data, 'turnovers', 0)
              },
              {
                x: 'Personal Fouls',
                y: _.get(props.data, 'personalFouls', 0)
              }
            ]}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default GeneralStatsChart;
