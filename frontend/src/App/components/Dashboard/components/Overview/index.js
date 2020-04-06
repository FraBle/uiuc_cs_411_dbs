import React from 'react';
import {
  Bullseye,
  Button,
  DataToolbar,
  DataToolbarContent,
  DataToolbarGroup,
  DataToolbarItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  FlexModifiers,
  PageSection,
  PageSectionVariants,
  Pagination,
  Select,
  SelectOption,
  SelectVariant,
  Text,
  TextContent,
  Title
} from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  SortAlphaDownIcon,
  SortAlphaUpIcon,
  StarIcon,
  OutlinedStarIcon
} from '@patternfly/react-icons';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Spinner } from '@patternfly/react-core';
import { AuthContext } from '../../../../Auth';

const initialState = {
  tables: [],
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TABLES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_TABLES_SUCCESS':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_TABLES_FAILURE':
      return {
        ...state,
        loading: true,
        error: action.payload.error
      };
    default:
      return state;
  }
};
const Overview = () => {
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_TABLES_REQUEST'
    });
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch(`${BACKEND}/api/table`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      })
      // fetch(`${BACKEND}/api/player/count`, {
      //   headers: {
      //     Authorization: `Bearer ${authState.token}`
      //   }
      // })
    ])
      .then(([tables]) => Promise.all([tables.json()]))
      .then(([tablesJson]) =>
        dispatch({
          type: 'FETCH_TABLES_SUCCESS',
          payload: {
            tables: tablesJson
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


  if (data.error) {
    return (
      <React.Fragment>
        Error
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Overview</Text>
          <Text component="p">Welcome!</Text>
        </TextContent>
      </PageSection>
      <PageSection>
      </PageSection>
    </React.Fragment>
  );
};

export default Overview;
