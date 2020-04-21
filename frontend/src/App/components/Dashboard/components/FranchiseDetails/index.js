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
import placeholderImg from '../../../../resources/placeholder.png';
import backgroundImg from '../../../../resources/background.jpg';

const initialState = {
  franchise: null,
  error: null,
  loading: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FRANCHISE_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_FRANCHISE_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        franchise: action.payload.franchise
      };
    case 'FETCH_FRANCHISE_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case 'CLOSE':
      return {
        ...state,
        franchise: null,
        error: null,
        loading: true
      };
    case 'FAVORITE_CREATED':
      return {
        ...state,
        franchise: { ...state.franchise, isFavorite: true }
      };
    case 'FAVORITE_DELETED':
      return {
        ...state,
        franchise: { ...state.franchise, isFavorite: false }
      };
    default:
      return state;
  }
};
const FranchiseDetail = props => {
  const [data, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'FETCH_FRANCHISE_REQUEST'
    });
    fetchData(props.franchise);
  }, [props.franchise]);

  const fetchData = franchise => {
    if (!franchise) return;
    fetch(`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${franchise.city} ${franchise.nickname}`)
      .then(franchise => franchise.json())
      .then(franchiseJson =>
        dispatch({
          type: 'FETCH_FRANCHISE_SUCCESS',
          payload: {
            franchise: franchiseJson.teams ? franchiseJson.teams[0] : null
          }
        })
      )
      .catch(error =>
        dispatch({
          type: 'FETCH_FRANCHISE_FAILURE',
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
      brandImageSrc={
        data.franchise ? (data.franchise.strTeamLogo ? data.franchise.strTeamLogo : placeholderImg) : placeholderImg
      }
      trademark="Additional info and photos powered by thesportsdb.com"
      brandImageAlt={props.franchise ? `${props.franchise.city} ${props.franchise.nickname}` : 'Loading Franchise Data'}
      productName={props.franchise ? `${props.franchise.city} ${props.franchise.nickname}` : 'Loading Franchise Data'}
      backgroundImageSrc={
        data.franchise
          ? data.franchise.strStadiumThumb
            ? data.franchise.strStadiumThumb
            : backgroundImg
          : backgroundImg
      }
    >
      {data.loading && !data.franchise ? (
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
          <TextContent>
            <TextList component="dl">
              <TextListItem component="dt">Franchise ID</TextListItem>
              <TextListItem component="dd">{props.franchise.id}</TextListItem>
              <TextListItem component="dt">Favorite</TextListItem>
              <TextListItem component="dd">
                <Switch
                  id="franchise-details-is-favorite"
                  isChecked={props.franchise.isFavorite}
                  onChange={() => props.toggleFavorite(props.franchise.id, props.franchise.isFavorite)}
                />
              </TextListItem>
              <TextListItem component="dt">Abbreviation</TextListItem>
              <TextListItem component="dd">{props.franchise.abbreviation}</TextListItem>
              <TextListItem component="dt">Nickname</TextListItem>
              <TextListItem component="dd">{props.franchise.nickname}</TextListItem>
              <TextListItem component="dt">Year Founded</TextListItem>
              <TextListItem component="dd">{props.franchise.yearFounded}</TextListItem>
              <TextListItem component="dt">City</TextListItem>
              <TextListItem component="dd">{props.franchise.city}</TextListItem>
              <TextListItem component="dt">Arena</TextListItem>
              <TextListItem component="dd">{props.franchise.arena}</TextListItem>
            </TextList>
          </TextContent>
          <Title size="xl">Additional Info</Title>
          <TextContent>
            <TextList component="dl">
              <TextListItem component="dt">Website</TextListItem>
              <TextListItem component="dd">
                <Button
                  variant="link"
                  icon={<GlobeIcon />}
                  onClick={() => window.open(`https://${data.franchise.strWebsite}`, '_blank')}
                >
                  {data.franchise.strWebsite}
                </Button>
              </TextListItem>
              <TextListItem component="dt">Facebook</TextListItem>
              <TextListItem component="dd">
                <Button
                  variant="link"
                  icon={<FacebookIcon />}
                  onClick={() => window.open(`https://${data.franchise.strFacebook}`, '_blank')}
                >
                  {data.franchise.strFacebook}
                </Button>
              </TextListItem>
              <TextListItem component="dt">Twitter</TextListItem>
              <TextListItem component="dd">
                <Button
                  variant="link"
                  icon={<TwitterIcon />}
                  onClick={() => window.open(`https://${data.franchise.strTwitter}`, '_blank')}
                >
                  {data.franchise.strTwitter}
                </Button>
              </TextListItem>
              <TextListItem component="dt">Instagram</TextListItem>
              <TextListItem component="dd">
                <Button
                  variant="link"
                  icon={<InstagramIcon />}
                  onClick={() => window.open(`https://${data.franchise.strInstagram}`, '_blank')}
                >
                  {data.franchise.strInstagram}
                </Button>
              </TextListItem>
              <TextListItem component="dt">YouTube</TextListItem>
              <TextListItem component="dd">
                <Button
                  variant="link"
                  icon={<YoutubeIcon />}
                  onClick={() => window.open(`https://${data.franchise.strYoutube}`, '_blank')}
                >
                  {data.franchise.strYoutube}
                </Button>
              </TextListItem>
            </TextList>
          </TextContent>
        </React.Fragment>
      )}
    </AboutModal>
  );
};

export default FranchiseDetail;
