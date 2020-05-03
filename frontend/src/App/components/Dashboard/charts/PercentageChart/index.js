import React from 'react';
import useComponentSize from '@rehooks/component-size';
import { ChartDonutUtilization } from '@patternfly/react-charts';
import numbro from 'numbro';
import _ from 'lodash';

const METADATA = {
  ariaDescription: 'Percentage Chart',
  ariaTitle: 'Percentage Chart'
};

const PercentageChart = props => {
  let ref = React.useRef(null);
  let size = useComponentSize(ref);
  let { width } = size;
  return (
    <div ref={ref} style={{ height: '250px' }}>
      <ChartDonutUtilization
        ariaDesc={METADATA.ariaDescription}
        ariaTitle={METADATA.ariaTitle}
        constrainToVisibleArea={true}
        data={{ x: props.label, y: props.value * 100 }}
        labels={({ datum }) =>
          datum.x ? `${datum.x}: ${numbro(datum.y / 100).format({ output: 'percent', mantissa: 1 })}` : null
        }
        subTitle={props.label}
        title={numbro(props.value).format({ output: 'percent', mantissa: 1 })}
        height={225}
        width={_.max([100, width])}
      />
    </div>
  );
};

export default PercentageChart;
