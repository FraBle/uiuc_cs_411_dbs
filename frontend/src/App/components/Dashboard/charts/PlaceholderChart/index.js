import React from 'react';
import {
  Bullseye,
  Title,
  EmptyState,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { ClockIcon } from '@patternfly/react-icons';


const PlaceholderChart = () => {
  return (
    <div style={{ minWidth: '300px', minHeight: '300px' }}>
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={ClockIcon} />
          <Title size="lg">Coming soon.</Title>
        </EmptyState>
      </Bullseye>
    </div>
  );
};

export default PlaceholderChart;
