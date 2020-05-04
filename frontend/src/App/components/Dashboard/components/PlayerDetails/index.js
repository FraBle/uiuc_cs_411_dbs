import React from 'react';
import {
  AboutModal,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateIcon,
  Switch,
  TextContent,
  TextList,
  TextListItem,
  Title
} from '@patternfly/react-core';
import { FacebookIcon, GlobeIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '@patternfly/react-icons';
import { Spinner } from '@patternfly/react-core';
import moment from 'moment';
import Img from 'react-image';
import placeholderImg from '../../../../resources/placeholder.png';
import backgroundImg from '../../../../resources/background.jpg';

const initialState = {
  player: null,
  error: null,
  loading: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PLAYER_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PLAYER_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        player: action.payload.player
      };
    case 'FETCH_PLAYER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case 'CLOSE':
      return {
        ...state,
        player: null,
        error: null,
        loading: true
      };
    case 'FAVORITE_CREATED':
      return {
        ...state,
        player: { ...state.player, isFavorite: true }
      };
    case 'FAVORITE_DELETED':
      return {
        ...state,
        player: { ...state.player, isFavorite: false }
      };
    default:
      return state;
  }
};
const PlayerDetail = props => {
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_PLAYER_REQUEST'
    });
    fetchData(props.player);
  }, [props.player]);

  const fetchData = player => {
    if (!player) return;
    fetch(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=${player.name}`)
      .then(player => player.json())
      .then(playerJson =>
        dispatch({
          type: 'FETCH_PLAYER_SUCCESS',
          payload: {
            player: playerJson.player ? playerJson.player[0] : null
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_PLAYER_FAILURE',
          payload: {
            error
          }
        })
      );
  };

  const onClose = () => {
    dispatch({ type: 'CLOSE' });
    props.toggle(null);
  };

  return (
    <AboutModal
      isOpen={props.isOpen}
      onClose={onClose}
      brandImageSrc={placeholderImg}
      trademark="Additional info and photos powered by thesportsdb.com"
      brandImageAlt={props.player ? props.player.name : 'Loading Player Data'}
      productName={props.player ? props.player.name : 'Loading Player Data'}
      backgroundImageSrc={backgroundImg}
    >
      {data.loading && !data.player ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : data.error ? (
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon icon={ExclamationTriangleIcon} />
            <Title size="lg">Could not load data.</Title>
          </EmptyState>
        </Bullseye>
      ) : (
        <React.Fragment>
          <Img src={data.player.strCutout} />
          <TextContent>
            <TextList component="dl">
              <TextListItem component="dt">Player ID</TextListItem>
              <TextListItem component="dd">{props.player.id}</TextListItem>
              <TextListItem component="dt">Favorite</TextListItem>
              <TextListItem component="dd">
                <Switch
                  id="player-details-is-favorite"
                  isChecked={props.player.isFavorite}
                  onChange={() => props.toggleFavorite(props.player.id, props.player.isFavorite)}
                />
              </TextListItem>
              <TextListItem component="dt">Birthdate</TextListItem>
              <TextListItem component="dd">{moment.utc(props.player.birthDate).format('ll')}</TextListItem>
              <TextListItem component="dt">Position</TextListItem>
              <TextListItem component="dd">{props.player.position}</TextListItem>
              <TextListItem component="dt">Height</TextListItem>
              <TextListItem component="dd">{`${props.player.height.split('-')[0]}' ${
                props.player.height.split('-')[1]
              }"`}</TextListItem>
              <TextListItem component="dt">Weight</TextListItem>
              <TextListItem component="dd">{`${props.player.weight} lbs`}</TextListItem>
            </TextList>
          </TextContent>
          <Title size="xl">Additional Info</Title>
          <TextContent>
            <TextList component="dl">
              {data.player.strNationality && (
                <React.Fragment>
                  <TextListItem component="dt">Nationality</TextListItem>
                  <TextListItem component="dd">{data.player.strNationality}</TextListItem>
                </React.Fragment>
              )}
              {data.player.strWage && (
                <React.Fragment>
                  <TextListItem component="dt">Wage</TextListItem>
                  <TextListItem component="dd">{data.player.strWage}</TextListItem>
                </React.Fragment>
              )}
              {data.player.strPosition && (
                <React.Fragment>
                  <TextListItem component="dt">Position</TextListItem>
                  <TextListItem component="dd">{data.player.strPosition}</TextListItem>
                </React.Fragment>
              )}
              {data.player.strWebsite && (
                <React.Fragment>
                  <TextListItem component="dt">Website</TextListItem>
                  <TextListItem component="dd">
                    <Button
                      variant="link"
                      icon={<GlobeIcon />}
                      onClick={() => window.open(`https://${data.player.strWebsite}`, '_blank')}
                    >
                      {data.player.strWebsite}
                    </Button>
                  </TextListItem>
                </React.Fragment>
              )}
              {data.player.strFacebook && (
                <React.Fragment>
                  <TextListItem component="dt">Facebook</TextListItem>
                  <TextListItem component="dd">
                    <Button
                      variant="link"
                      icon={<FacebookIcon />}
                      onClick={() => window.open(`https://${data.player.strFacebook}`, '_blank')}
                    >
                      {data.player.strFacebook}
                    </Button>
                  </TextListItem>
                </React.Fragment>
              )}
              {data.player.strTwitter && (
                <React.Fragment>
                  <TextListItem component="dt">Twitter</TextListItem>
                  <TextListItem component="dd">
                    <Button
                      variant="link"
                      icon={<TwitterIcon />}
                      onClick={() => window.open(`https://${data.player.strTwitter}`, '_blank')}
                    >
                      {data.player.strTwitter}
                    </Button>
                  </TextListItem>
                </React.Fragment>
              )}
              {data.player.strInstagram && (
                <React.Fragment>
                  <TextListItem component="dt">Instagram</TextListItem>
                  <TextListItem component="dd">
                    <Button
                      variant="link"
                      icon={<InstagramIcon />}
                      onClick={() => window.open(`https://${data.player.strInstagram}`, '_blank')}
                    >
                      {data.player.strInstagram}
                    </Button>
                  </TextListItem>
                </React.Fragment>
              )}
              {data.player.strYoutube && (
                <React.Fragment>
                  <TextListItem component="dt">YouTube</TextListItem>
                  <TextListItem component="dd">
                    <Button
                      variant="link"
                      icon={<YoutubeIcon />}
                      onClick={() => window.open(`https://${data.player.strYoutube}`, '_blank')}
                    >
                      {data.player.strYoutube}
                    </Button>
                  </TextListItem>
                </React.Fragment>
              )}
            </TextList>
          </TextContent>
        </React.Fragment>
      )}
    </AboutModal>
  );
};

export default PlayerDetail;
