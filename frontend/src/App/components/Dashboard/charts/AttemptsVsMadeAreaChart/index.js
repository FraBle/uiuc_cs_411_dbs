import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartArea, ChartAxis, ChartGroup, ChartScatter, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'Attempts vs. Made Area Chart',
  ariaTitle: 'Attempts vs. Made Area Chart'
};

const AttemptsVsMadeAreaChart = props => {
  let ref = React.useRef(null);
  let size = useComponentSize(ref);
  let { width } = size;

  const createSeries = () => {
    const result = {
      fieldGoalsMade: {
        datapoints: [],
        legendItem: { name: 'Field Goals Made' }
      },
      fieldGoalsAttempted: {
        datapoints: [],
        legendItem: { name: 'Field Goals Attempted' }
      },
      threePointersMade: {
        datapoints: [],
        legendItem: { name: 'Three Pointers Made' }
      },
      threePointersAttempted: {
        datapoints: [],
        legendItem: { name: 'Three Pointers Attempted' }
      },
      freeThrowsMade: {
        datapoints: [],
        legendItem: { name: 'Free Throws Made' }
      },
      freeThrowsAttempted: {
        datapoints: [],
        legendItem: { name: 'Free Throws Attempted' }
      }
    };
    _.map(props.data, el => {
      result.fieldGoalsMade.datapoints.push({
        name: result.fieldGoalsMade.legendItem.name,
        x: `${el.season}`,
        y: el.fieldGoalsMade
      });
      result.fieldGoalsAttempted.datapoints.push({
        name: result.fieldGoalsAttempted.legendItem.name,
        x: `${el.season}`,
        y: el.fieldGoalsAttempted
      });
      result.threePointersMade.datapoints.push({
        name: result.threePointersMade.legendItem.name,
        x: `${el.season}`,
        y: el.threePointersMade
      });
      result.threePointersAttempted.datapoints.push({
        name: result.threePointersAttempted.legendItem.name,
        x: `${el.season}`,
        y: el.threePointersAttempted
      });
      result.freeThrowsMade.datapoints.push({
        name: result.freeThrowsMade.legendItem.name,
        x: `${el.season}`,
        y: el.freeThrowsMade
      });
      result.freeThrowsAttempted.datapoints.push({
        name: result.freeThrowsAttempted.legendItem.name,
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
          right: 225,
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

export default AttemptsVsMadeAreaChart;
