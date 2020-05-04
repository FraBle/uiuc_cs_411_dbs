import React from 'react';
import {
  Bullseye,
  ContextSelector,
  ContextSelectorItem,
  EmptyState,
  EmptyStateIcon,
  Spinner,
  Title
} from '@patternfly/react-core';

import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { AuthContext } from '../../../../Auth';
import _ from 'lodash';

const initialState = {
  franchises: [],
  filteredFranchises: [],
  selectedFranchise: null,
  searchInput: '',
  dropdownIsOpen: false,
  loading: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FRANCHISES':
      return {
        ...state,
        loading: false,
        franchises: action.payload.franchises,
        filteredFranchises: action.payload.franchises
      };
    case 'FILTER_FRANCHISES':
      return {
        ...state,
        filteredFranchises: _.filter(state.franchises, franchise =>
          _.includes(
            _.toLower(_.join(_.concat(_.split(franchise.city, /\s+/), _.split(franchise.nickname, /\s+/)), '')),
            _.toLower(_.join(_.split(action.payload.filter, /\s+/), ''))
          )
        )
      };
    case 'FETCH_FRANCHISES_FAILURE':
      return {
        ...state,
        loading: false
      };
    case 'SEARCH_FRANCHISE_INPUT':
      return {
        ...state,
        searchInput: action.payload.value
      };
    case 'TOGGLE_FRANCHISE_DROPDOWN':
      return {
        ...state,
        dropdownIsOpen: action.payload.isOpen
      };
    case 'SELECT_FRANCHISE':
      return {
        ...state,
        selectedFranchise: action.payload.franchise,
        dropdownIsOpen: !state.dropdownIsOpen
      };
    default:
      return state;
  }
};

const Franchise = props => {
  return `${props.data.city} ${props.data.nickname}`;
};

const FranchiseSearch = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (!props.useLocal) {
      // In case no franchises are provided, load them dynamically from then backend
      fetchFranchises();
    } else {
      dispatch({
        type: 'SET_FRANCHISES',
        payload: {
          franchises: props.franchises
        }
      });
    }
  }, []);

  const fetchFranchises = () => {
    fetch(`${BACKEND}/api/franchise?pageSize=100&page=1&order=city,nickname&orderType=ASC`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(franchises =>
        dispatch({
          type: 'SET_FRANCHISES',
          payload: { franchises }
        })
      )
      .catch(error => {
        dispatch({ type: 'FETCH_FRANCHISES_FAILURE' });
        props.onError('Could not load franchises 😔');
      });
  };

  const onSearchInputChange = value => {
    dispatch({
      type: 'SEARCH_FRANCHISE_INPUT',
      payload: {
        value
      }
    });
  };

  const onDropdownToggle = (_, isOpen) =>
    dispatch({
      type: 'TOGGLE_FRANCHISE_DROPDOWN',
      payload: {
        isOpen
      }
    });

  const onDropdownSelect = (_, franchise) => {
    dispatch({
      type: 'SELECT_FRANCHISE',
      payload: {
        franchise: `${franchise.props.data.city} ${franchise.props.data.nickname}`
      }
    });
    props.onFranchiseSelect(franchise.props.data);
  };

  const onSearchButtonClick = () => {
    dispatch({
      type: 'FILTER_FRANCHISES',
      payload: {
        filter: data.searchInput
      }
    });
  };

  return data.loading ? (
    <Bullseye>
      <Spinner size="md" />
    </Bullseye>
  ) : (
    <ContextSelector
      toggleText={data.selectedFranchise ? data.selectedFranchise : 'Select a Franchise'}
      onSearchInputChange={onSearchInputChange}
      isOpen={data.dropdownIsOpen}
      searchInputValue={data.searchInput}
      onToggle={onDropdownToggle}
      onSelect={onDropdownSelect}
      onSearchButtonClick={onSearchButtonClick}
      screenReaderLabel="Selected Franchise:"
      style={{ width: props.width }}
    >
      {data.filteredFranchises.map(franchise => (
        <ContextSelectorItem key={franchise.id}>
          <Franchise id={franchise.id} data={franchise} />
        </ContextSelectorItem>
      ))}
    </ContextSelector>
  );
};

export default FranchiseSearch;
