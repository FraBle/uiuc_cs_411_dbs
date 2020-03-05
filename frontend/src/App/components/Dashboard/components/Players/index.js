import React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
  Pagination,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Spinner } from '@patternfly/react-core';

const initialState = {
  res: [],
  perPage: 0,
  total: 0,
  page: 0,
  error: null,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PLAYERS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PLAYERS_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        total: 100,
        res: action.payload.response,
        perPage: action.payload.perPage,
        page: action.payload.page
      };
    case 'FETCH_PLAYERS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        loading: false,
        perPage: 0,
        page: 0,
        total: 0
      };
    default:
      return state;
  }
};
const Players = () => {

  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_PLAYERS_REQUEST'
    });
    fetchData(data.page || 1, data.perPage || 20);
  }, []);

  const fetchData = (page, perPage) => {
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${perPage}`)
      .then(resp => resp.json())
      .then(respJson => dispatch({
        type: "FETCH_PLAYERS_SUCCESS",
        payload: {
          response: respJson,
          perPage,
          page,
          loading: false,
          total: 100,
        }
      }))
      .catch(error => dispatch({
        type: "FETCH_PLAYERS_FAILURE",
        payload: {
          error,
        }
      }));
  }

  const renderPagination = (variant = 'top') => {
    return (
      <Pagination
        itemCount={data.total}
        page={data.page}
        perPage={data.perPage}
        onSetPage={(_evt, value) => fetchData(value, data.perPage)}
        onPerPageSelect={(_evt, value) => fetchData(1, value)}
        variant={variant}
      />
    );
  }


  if (data.error) {
    const noResultsRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 8 },
            title: (
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={ExclamationCircleIcon} color={globalDangerColor200.value} />
                  <Title headingLevel="h2" size="lg">
                    Unable to connect
                  </Title>
                  <EmptyStateBody>
                    There was an error retrieving data. Check your connection and try again.
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            )
          }
        ]
      }
    ];

    return (
      <React.Fragment>
        <Table cells={['Title', 'Body']} rows={noResultsRows} aria-label="Pagination Table Demo">
          <TableHeader />
          <TableBody />
        </Table>
      </React.Fragment>
    );
  }

  const loadingRows = [{
    heightAuto: true,
    cells: [
      {
        props: { colSpan: 8 },
        title: (
          <Bullseye>
            <center>
              <Spinner size="xl" />
            </center>
          </Bullseye>
        )
      }
    ]
  }];

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Players</Text>
          <Text component="p">Overview over all players currently in the DB</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        {renderPagination()}
        {!data.loading && (
          <Table
            cells={['Title', 'Body']}
            rows={data.res.map(post => [post.title, post.body])}
            aria-label="Pagination Table Demo"
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {data.loading && (
          <Table cells={['Title', 'Body']} rows={loadingRows} aria-label="Pagination Table Demo">
            <TableHeader />
            <TableBody />
          </Table>
        )}
      </PageSection>
    </React.Fragment>
  );
}

export default Players;
