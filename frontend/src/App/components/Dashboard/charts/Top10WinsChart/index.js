import React from 'react';
import {
  Bullseye,
  Spinner,
  Title,
  EmptyState,
  EmptyStateIcon,
  SimpleList,
  SimpleListItem,
  SimpleListGroup,
  Text,
  TextVariants
} from '@patternfly/react-core';
import { AuthContext } from '../../../../Auth';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import PlayerDetails from '../../components/PlayerDetails';
import FranchiseDetails from '../../components/FranchiseDetails';

const initialState = {
  hasError: false,
  loading: false,
  data: [],
  selectedPlayer: null,
  selectedFranchise: null,
  franchiseDetailModalOpen: false,
  playerDetailModalOpen: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.result
      };
    case 'DETAIL_MODAL_TOGGLE':
      return {
        ...state,
        franchiseDetailModalOpen:
          action.payload.type === 'FRANCHISE' ? !state.franchiseDetailModalOpen : state.franchiseDetailModalOpen,
        playerDetailModalOpen:
          action.payload.type === 'PLAYER' ? !state.playerDetailModalOpen : state.playerDetailModalOpen,
        selectedFranchise: action.payload.type === 'FRANCHISE' ? action.payload.data : state.selectedFranchise,
        selectedPlayer: action.payload.type === 'PLAYER' ? action.payload.data : state.selectedPlayer
      };
    case 'FAVORITE_CREATED':
      return {
        ...state,
        selectedPlayer:
          action.payload.type === 'PLAYER' && state.selectedPlayer && state.selectedPlayer.id === action.payload.id
            ? {
                ...state.selectedPlayer,
                isFavorite: true
              }
            : state.selectedPlayer,
        selectedFranchise:
          action.payload.type === 'FRANCHISE' &&
          state.selectedFranchise &&
          state.selectedFranchise.id === action.payload.id
            ? {
                ...state.selectedFranchise,
                isFavorite: true
              }
            : state.selectedFranchise
      };
    case 'FAVORITE_DELETED':
      return {
        ...state,
        selectedPlayer:
          action.payload.type === 'PLAYER' && state.selectedPlayer && state.selectedPlayer.id === action.payload.id
            ? {
                ...state.selectedPlayer,
                isFavorite: false
              }
            : state.selectedPlayer,
        selectedFranchise:
          action.payload.type === 'FRANCHISE' &&
          state.selectedFranchise &&
          state.selectedFranchise.id === action.payload.id
            ? {
                ...state.selectedFranchise,
                isFavorite: false
              }
            : state.selectedFranchise
      };
    default:
      return state;
  }
};

const Top10WinsChart = props => {
  const { state: authState } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_REQUEST'
    });
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${BACKEND}/api/${props.type}/stats/top/victories?topN=10`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(result => {
        dispatch({
          type: `FETCH_SUCCESS`,
          payload: { result }
        });
      })
      .catch(error => {
        props.showAlert('Could not load data 😔', 'danger');
      });
  };

  const onToggleDetailModal = (type, data) => {
    dispatch({
      type: 'DETAIL_MODAL_TOGGLE',
      payload: { type, data }
    });
  };

  const onToggleFavorite = (type, id, isFavorite) => {
    fetch(`${BACKEND}/api/user/${authState.username}/favorite/${type.toLowerCase()}/${id}`, {
      method: isFavorite ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.ok)
          isFavorite
            ? dispatch({
                type: 'FAVORITE_DELETED',
                payload: { type, id }
              })
            : dispatch({
                type: 'FAVORITE_CREATED',
                payload: { type, id }
              });
        else props.showAlert("Ooops, looks like that didn't work 😔");
      })
      .then(() => fetchData())
      .catch(error => {
        props.showAlert("Ooops, looks like that didn't work 😔");
      });
  };

  const onClick = (type, id) => {
    if (!id) return;
    fetch(`${BACKEND}/api/${type}/${id}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => onToggleDetailModal(_.upperCase(props.type), data))
      .catch(error => {
        props.showAlert('Could not load data 😔', 'danger');
      });
  };

  return state.loading ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : state.hasError ? (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon icon={ExclamationTriangleIcon} />
        <Title size="lg">Could not load data.</Title>
      </EmptyState>
    </Bullseye>
  ) : (
    <React.Fragment>
      <PlayerDetails
        player={state.selectedPlayer}
        isOpen={state.playerDetailModalOpen}
        showAlert={props.showAlert}
        toggle={(...params) => onToggleDetailModal('PLAYER', ...params)}
        toggleFavorite={(...params) => onToggleFavorite('PLAYER', ...params)}
      />
      <FranchiseDetails
        franchise={state.selectedFranchise}
        isOpen={state.franchiseDetailModalOpen}
        showAlert={props.showAlert}
        toggle={(...params) => onToggleDetailModal('FRANCHISE', ...params)}
        toggleFavorite={(...params) => onToggleFavorite('FRANCHISE', ...params)}
      />
      <SimpleList>
        <SimpleListGroup title={`${_.startCase(props.type)}s`} id="toplist">
          {!_.isEmpty(state.data) ? (
            state.data.map((entry, i) => (
              <SimpleListItem
                key={'entry-' + entry[`${props.type}Id`]}
                onClick={() => onClick(props.type, entry[`${props.type}Id`])}
              >
                {i + 1}. {_.get(entry, `${props.type}Name`)}
              </SimpleListItem>
            ))
          ) : (
            <Text component={TextVariants.small}>No data to show (yet).</Text>
          )}
        </SimpleListGroup>
      </SimpleList>
    </React.Fragment>
  );
};

export default Top10WinsChart;
