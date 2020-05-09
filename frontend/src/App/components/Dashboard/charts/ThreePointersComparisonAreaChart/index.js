import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartArea, ChartAxis, ChartGroup, ChartScatter, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Three Pointers Comparison Area Chart',
  ariaTitle: 'Three Pointers Comparison Area Chart'
};

const ThreePointersComparisonAreaChart = props => {
  let ref = React.useRef(null);
  let size = useComponentSize(ref);
  let { width } = size;

  const createSeries = () => {
    const result = {
      threePointersMade1: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName1 ? 'N/A' : props.opponentName1}: Three Pointers Made` }
      },
      threePointersAttempted1: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName1 ? 'N/A' : props.opponentName1}: Three Pointers Attempted` }
      },
      threePointersMade2: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName2 ? 'N/A' : props.opponentName2}: Three Pointers Made` }
      },
      threePointersAttempted2: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName2 ? 'N/A' : props.opponentName2}: Three Pointers Attempted` }
      }
    };
    _.map(props.opponentData1, el => {
      result.threePointersMade1.datapoints.push({
        name: result.threePointersMade1.legendItem.name,
        x: `${el.season}`,
        y: el.threePointersMade
      });
      result.threePointersAttempted1.datapoints.push({
        name: result.threePointersAttempted1.legendItem.name,
        x: `${el.season}`,
        y: el.threePointersAttempted
      });
    });
    _.map(props.opponentData2, el => {
      result.threePointersMade2.datapoints.push({
        name: result.threePointersMade2.legendItem.name,
        x: `${el.season}`,
        y: el.threePointersMade
      });
      result.threePointersAttempted2.datapoints.push({
        name: result.threePointersAttempted2.legendItem.name,
        x: `${el.season}`,
        y: el.threePointersAttempted
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

export default ThreePointersComparisonAreaChart;
