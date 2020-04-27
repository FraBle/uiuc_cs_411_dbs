import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { Chart, ChartArea, ChartAxis, ChartGroup, ChartScatter, ChartVoronoiContainer } from '@patternfly/react-charts';
import numbro from 'numbro';

const METADATA = {
  ariaDescription: 'General Stats Area Chart',
  ariaTitle: 'General Stats Area Chart'
};

const GeneralStatsAreaChart = props => {
  let ref = React.useRef(null);
  let size = useComponentSize(ref);
  let { width } = size;

  const createSeries = () => {
    const result = {
      steals: {
        datapoints: [],
        legendItem: { name: 'Steals' }
      },
      blocks: {
        datapoints: [],
        legendItem: { name: 'Blocks' }
      },
      turnovers: {
        datapoints: [],
        legendItem: { name: 'Turnovers' }
      },
      personalFouls: {
        datapoints: [],
        legendItem: { name: 'Personal Fouls' }
      }
    };
    _.map(props.data, el => {
      result.steals.datapoints.push({
        name: result.steals.legendItem.name,
        x: `${el.season}`,
        y: el.steals
      });
      result.blocks.datapoints.push({
        name: result.blocks.legendItem.name,
        x: `${el.season}`,
        y: el.blocks
      });
      result.turnovers.datapoints.push({
        name: result.turnovers.legendItem.name,
        x: `${el.season}`,
        y: el.turnovers
      });
      result.personalFouls.datapoints.push({
        name: result.personalFouls.legendItem.name,
        x: `${el.season}`,
        y: el.personalFouls
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

export default GeneralStatsAreaChart;
