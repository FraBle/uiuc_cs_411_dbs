import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartArea, ChartAxis, ChartGroup, ChartScatter, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Field Goals Comparison Area Chart',
  ariaTitle: 'Field Goals Comparison Area Chart'
};

const FieldGoalsComparisonAreaChart = props => {
  let ref = React.useRef(null);
  let size = useComponentSize(ref);
  let { width } = size;

  const createSeries = () => {
    const result = {
      fieldGoalsMade1: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName1 ? 'N/A' : props.opponentName1}: Field Goals Made` }
      },
      fieldGoalsAttempted1: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName1 ? 'N/A' : props.opponentName1}: Field Goals Attempted` }
      },
      fieldGoalsMade2: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName2 ? 'N/A' : props.opponentName2}: Field Goals Made` }
      },
      fieldGoalsAttempted2: {
        datapoints: [],
        legendItem: { name: `${!props.opponentName2 ? 'N/A' : props.opponentName2}: Field Goals Attempted` }
      }
    };
    _.map(props.opponentData1, el => {
      result.fieldGoalsMade1.datapoints.push({
        name: result.fieldGoalsMade1.legendItem.name,
        x: `${el.season}`,
        y: el.fieldGoalsMade
      });
      result.fieldGoalsAttempted1.datapoints.push({
        name: result.fieldGoalsAttempted1.legendItem.name,
        x: `${el.season}`,
        y: el.fieldGoalsAttempted
      });
    });
    _.map(props.opponentData2, el => {
      result.fieldGoalsMade2.datapoints.push({
        name: result.fieldGoalsMade2.legendItem.name,
        x: `${el.season}`,
        y: el.fieldGoalsMade
      });
      result.fieldGoalsAttempted2.datapoints.push({
        name: result.fieldGoalsAttempted2.legendItem.name,
        x: `${el.season}`,
        y: el.fieldGoalsAttempted
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

export default FieldGoalsComparisonAreaChart;
