import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartAxis, ChartBar, ChartGroup, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Points vs. Assists Chart',
  ariaTitle: 'Points vs. Assists Chart'
};

const PointsVsAssistsChart = props => {
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
        domainPadding={{ x: 120 }}
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
        <ChartGroup>
          <ChartBar
            barWidth={60}
            data={[
              {
                x: 'Points',
                y: _.get(props.data, 'points', 0)
              },
              {
                x: 'Assists',
                y: _.get(props.data, 'assists', 0)
              }
            ]}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default PointsVsAssistsChart;
