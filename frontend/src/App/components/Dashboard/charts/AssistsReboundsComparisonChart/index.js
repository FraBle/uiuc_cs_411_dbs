import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartAxis, ChartBar, ChartGroup, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Assists & Rebounds Comparison Chart',
  ariaTitle: 'Assists & Rebounds Comparison Chart'
};

const AssistsReboundsComparisonChart = props => {
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
        legendData={[{ name: _.get(props, 'homeFranchise') }, { name: _.get(props, 'visitorFranchise') }]}
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
                name: _.get(props, 'homeFranchise'),
                x: 'Assists',
                y: _.get(props, 'homeAssists', 0)
              },
              {
                name: _.get(props, 'homeFranchise'),
                x: 'Rebounds',
                y: _.get(props, 'homeRebounds', 0)
              }
            ]}
          />
          <ChartBar
            data={[
              {
                name: _.get(props, 'visitorFranchise'),
                x: 'Assists',
                y: _.get(props, 'awayAssists', 0)
              },
              {
                name: _.get(props, 'visitorFranchise'),
                x: 'Rebounds',
                y: _.get(props, 'awayRebounds', 0)
              }
            ]}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default AssistsReboundsComparisonChart;
