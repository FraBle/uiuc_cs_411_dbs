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
      assists1: {
        datapoints: [],
        legendItem: { name: `${!props.playerName1 ? 'N/A' : props.playerName1}: Assists` }
      },
      steals1: {
        datapoints: [],
        legendItem: { name: `${!props.playerName1 ? 'N/A' : props.playerName1}: Steals` }
      },
      blocks1: {
        datapoints: [],
        legendItem: { name: `${!props.playerName1 ? 'N/A' : props.playerName1}: Blocks` }
      },
      turnovers1: {
        datapoints: [],
        legendItem: { name: `${!props.playerName1 ? 'N/A' : props.playerName1}: Turnovers` }
      },
      fouls1: {
        datapoints: [],
        legendItem: { name: `${!props.playerName1 ? 'N/A' : props.playerName1}: Fouls` }
      },
      assists2: {
        datapoints: [],
        legendItem: { name: `${!props.playerName2 ? 'N/A' : props.playerName2}: Assists` }
      },
      steals2: {
        datapoints: [],
        legendItem: { name: `${!props.playerName2 ? 'N/A' : props.playerName2}: Steals` }
      },
      blocks2: {
        datapoints: [],
        legendItem: { name: `${!props.playerName2 ? 'N/A' : props.playerName2}: Blocks` }
      },
      turnovers2: {
        datapoints: [],
        legendItem: { name: `${!props.playerName2 ? 'N/A' : props.playerName2}: Turnovers` }
      },
      fouls2: {
        datapoints: [],
        legendItem: { name: `${!props.playerName2 ? 'N/A' : props.playerName2}: Fouls` }
      }
    };
    _.map(props.playerData1, el => {
      result.assists1.datapoints.push({
        name: result.assists1.legendItem.name,
        x: `${el.season}`,
        y: el.assists
      });
      result.steals1.datapoints.push({
        name: result.steals1.legendItem.name,
        x: `${el.season}`,
        y: el.steals
      });
      result.blocks1.datapoints.push({
        name: result.blocks1.legendItem.name,
        x: `${el.season}`,
        y: el.blocks
      });
      result.turnovers1.datapoints.push({
        name: result.turnovers1.legendItem.name,
        x: `${el.season}`,
        y: el.turnovers
      });
      result.fouls1.datapoints.push({
        name: result.fouls1.legendItem.name,
        x: `${el.season}`,
        y: el.personalFouls
      });
    });
    _.map(props.playerData2, el => {
      result.assists2.datapoints.push({
        name: result.assists2.legendItem.name,
        x: `${el.season}`,
        y: el.assists
      });
      result.steals2.datapoints.push({
        name: result.steals2.legendItem.name,
        x: `${el.season}`,
        y: el.steals
      });
      result.blocks2.datapoints.push({
        name: result.blocks2.legendItem.name,
        x: `${el.season}`,
        y: el.blocks
      });
      result.turnovers2.datapoints.push({
        name: result.turnovers2.legendItem.name,
        x: `${el.season}`,
        y: el.turnovers
      });
      result.fouls2.datapoints.push({
        name: result.fouls2.legendItem.name,
        x: `${el.season}`,
        y: el.personalFouls
      });
    });
    return _.values(result);
  };

  const series = createSeries();

  return (
    <div ref={ref} style={{ height: '525px' }}>
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
        height={500}
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
