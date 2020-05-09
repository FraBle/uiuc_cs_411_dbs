import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartArea, ChartAxis, ChartGroup, ChartScatter, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Free Throws Comparison Area Chart',
  ariaTitle: 'Free Throws Comparison Area Chart'
};

const FreeThrowsComparisonAreaChart = props => {
  let ref = React.useRef(null);
  let size = useComponentSize(ref);
  let { width } = size;

  const createSeries = () => {
    const result = {
      freeThrowsMade1: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName1 ? 'N/A' : props.opponentName1}: Free Throws Made` }
      },
      freeThrowsAttempted1: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName1 ? 'N/A' : props.opponentName1}: Free Throws Attempted` }
      },
      freeThrowsMade2: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName2 ? 'N/A' : props.opponentName2}: Free Throws Made` }
      },
      freeThrowsAttempted2: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName2 ? 'N/A' : props.opponentName2}: Free Throws Attempted` }
      }
    };
    _.map(props.opponentData1, el => {
      result.freeThrowsMade1.datapoints.push({
        name: result.freeThrowsMade1.legendItem.name,
        x: `${el.season}`,
        y: el.freeThrowsMade
      });
      result.freeThrowsAttempted1.datapoints.push({
        name: result.freeThrowsAttempted1.legendItem.name,
        x: `${el.season}`,
        y: el.freeThrowsAttempted
      });
    });
    _.map(props.opponentData2, el => {
      result.freeThrowsMade2.datapoints.push({
        name: result.freeThrowsMade2.legendItem.name,
        x: `${el.season}`,
        y: el.freeThrowsMade
      });
      result.freeThrowsAttempted2.datapoints.push({
        name: result.freeThrowsAttempted2.legendItem.name,
        x: `${el.season}`,
        y: el.freeThrowsAttempted
      });
    });
    return _.values(result);
  };

  const series = createSeries();

  return (
    <div ref={ref} style={{ height: '250px' }}>
      <Chart
        ariaDesc={METADATA.ariaDescription}
        ariaTitle={METADATA.ariaTitle}
        containerComponent={
          <ChartVoronoiContainer
            labels={({ datum }) =>
              datum.childName.includes('area-')
                ? `${datum.name}: ${numbro(datum.y).format({ thousandSeparated: true })}`
                : null
            }
            constrainToVisibleArea
          />
        }
        legendData={series.map(s => s.legendItem)}
        legendOrientation="vertical"
        legendPosition="right"
        height={225}
        padding={{
          bottom: 50,
          left: 75,
          right: 300,
          top: 50
        }}
        width={width}
      >
        <ChartAxis />
        <ChartAxis dependentAxis showGrid />
        <ChartGroup>
          {_.map(series, (s, idx) => (
            <ChartScatter data={s.datapoints} key={'scatter-' + idx} name={'scatter-' + idx} />
          ))}
        </ChartGroup>
        <ChartGroup>
          {_.map(series, (s, idx) => (
            <ChartArea interpolation="monotoneX" key={'area-' + idx} name={'area-' + idx} data={s.datapoints} />
          ))}
        </ChartGroup>
      </Chart>
    </div>
  );
};

export default FreeThrowsComparisonAreaChart;
