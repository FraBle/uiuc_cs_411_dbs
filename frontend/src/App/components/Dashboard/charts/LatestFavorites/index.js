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
  hasData: false,
  hasError: false,
  loading: false,
  error: null,
  favoritePlayers: [],
  favoriteFranchises: [],
  selectedPlayer: null,
  selectedFranchise: null,
  franchiseDetailModalOpen: false,
  playerDetailModalOpen: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FAVORITES_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_FAVORITES_SUCCESS':
      return {
        ...state,
        loading: false,
        hasData: true,
        favoritePlayers: action.payload.favoritePlayers,
        favoriteFranchises: action.payload.favoriteFranchises
      };
    case 'FETCH_FAVORITES_FAILURE':
      return {
        ...state,
        loading: false,
        hasError: true,
        error: action.payload.error
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

const LatestFavorites = props => {
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext);
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_FAVORITES_REQUEST'
    });
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch(
        `${BACKEND}/api/user/${authState.username}/favorite/player?pageSize=4&page=1&order=createdAt&orderType=DESC`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      ),
      fetch(
        `${BACKEND}/api/user/${authState.username}/favorite/franchise?pageSize=4&page=1&order=createdAt&orderType=DESC`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      )
    ])
      .then(([players, franchises]) => Promise.all([players.json(), franchises.json()]))
      .then(([playersJson, franchisesJson]) =>
        dispatch({
          type: 'FETCH_FAVORITES_SUCCESS',
          payload: {
            favoritePlayers: playersJson,
            favoriteFranchises: franchisesJson
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_FAVORITES_FAILURE',
          payload: {
            error
          }
        })
      );
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

  return !data.hasData ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : data.hasError ? (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon icon={ExclamationTriangleIcon} />
        <Title size="lg">Could not load data.</Title>
      </EmptyState>
    </Bullseye>
  ) : (
    <React.Fragment>
      <PlayerDetails
        player={data.selectedPlayer}
        isOpen={data.playerDetailModalOpen}
        showAlert={props.showAlert}
        toggle={(...params) => onToggleDetailModal('PLAYER', ...params)}
        toggleFavorite={(...params) => onToggleFavorite('PLAYER', ...params)}
      />
      <FranchiseDetails
        franchise={data.selectedFranchise}
        isOpen={data.franchiseDetailModalOpen}
        showAlert={props.showAlert}
        toggle={(...params) => onToggleDetailModal('FRANCHISE', ...params)}
        toggleFavorite={(...params) => onToggleFavorite('FRANCHISE', ...params)}
      />
      <SimpleList>
        <SimpleListGroup title="Franchises" id="franchises">
          {data.favoriteFranchises && data.favoriteFranchises.length ? (
            data.favoriteFranchises.map(franchise => (
              <SimpleListItem
                key={'franchise-' + franchise.id}
                onClick={() => onToggleDetailModal('FRANCHISE', franchise)}
              >
                {franchise.city} {franchise.nickname}
              </SimpleListItem>
            ))
          ) : (
            <Text component={TextVariants.small}>You don't have any favorite franchises yet 😱</Text>
          )}
        </SimpleListGroup>
        <SimpleListGroup title="Players" id="players">
          {data.favoritePlayers && data.favoritePlayers.length ? (
            data.favoritePlayers.map(player => (
              <SimpleListItem key={'player-' + player.id} onClick={() => onToggleDetailModal('PLAYER', player)}>
                {player.name}
              </SimpleListItem>
            ))
          ) : (
            <Text component={TextVariants.small}>You didn't fave any players yet 😔</Text>
          )}
        </SimpleListGroup>
      </SimpleList>
    </React.Fragment>
  );
};

export default LatestFavorites;
