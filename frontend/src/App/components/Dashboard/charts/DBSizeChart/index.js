import React from 'react';
import {
  Bullseye,
  Spinner,
  Title,
  Button,
  EmptyState,
  EmptyStatePrimary,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions
} from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts';
import { AuthContext } from '../../../../Auth';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import numbro from 'numbro';

const TABLES = [
  'College',
  'FavoritesFranchise',
  'FavoritesPlayer',
  'Franchise',
  'Games',
  'Player',
  'PlayerGameStats',
  'User'
];

const METADATA = {
  ariaDescription: 'DB Size Chart',
  ariaTitle: 'DB Size Chart',
  subTitle: 'Entries'
};

const initialState = {
  hasData: false,
  hasError: false,
  loading: false,
  error: null,
  chartData: [],
  legendData: [],
  tables: []
};

const labels = ({datum}) => `${datum.x}: ${numbro(datum.y).format({thousandSeparated: true})}`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TABLES_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_TABLES_SUCCESS':
      return {
        ...state,
        loading: false,
        hasData: true,
        tables: action.payload.tables,
        chartData: action.payload.tables.map(datum => ({
          x: datum.name,
          y: datum.value
        })),
        legendData: action.payload.tables.map(datum => ({
          name: `${datum.name}: ${datum.value}`
        }))
      };
    case 'FETCH_TABLES_FAILURE':
      return {
        ...state,
        loading: false,
        hasError: true,
        error: action.payload.error
      };
    default:
      return state;
  }
};

const DBSizeChart = props => {
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_TABLES_REQUEST'
    });
    fetchData();
  }, []);

  const filterTables = tables =>
    tables
      .filter(table => TABLES.includes(table.name))
      .map(table => ({
        name: table.name,
        value: table.nRows
      }));

  const fetchData = () => {
    Promise.all([
      fetch(`${BACKEND}/api/table`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      })
    ])
      .then(([tables]) => Promise.all([tables.json()]))
      .then(([tablesJson]) =>
        dispatch({
          type: 'FETCH_TABLES_SUCCESS',
          payload: {
            tables: filterTables(tablesJson)
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_TABLES_FAILURE',
          payload: {
            error
          }
        })
      );
  };

  return !state.hasData ? (
    <div style={{ minWidth: '300px', minHeight: '300px' }}>
      <Bullseye>
        <Spinner />
      </Bullseye>
    </div>
  ) : state.hasError ? (
    <div style={{ minWidth: '300px', minHeight: '300px' }}>
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={ExclamationTriangleIcon} />
          <Title size="lg">Could not load data.</Title>
        </EmptyState>
      </Bullseye>
    </div>
  ) : (
    <div style={{ width: '300px', height: '300px', minWidth: '300px', minHeight: '300px', maxWidth: '300px', maxHeight: '300px' }}>
      <ChartDonut
        ariaDesc={METADATA.ariaDescription}
        ariaTitle={METADATA.ariaTitle}
        constrainToVisibleArea={true}
        data={state.chartData}
        labels={labels}
        subTitle={METADATA.subTitle}
        title={numbro(state.chartData.reduce((total, {y}) => total + y, 0)).format({thousandSeparated: true})}
      />
    </div>
  );
};

export default DBSizeChart;
