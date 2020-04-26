import React from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  Avatar,
  Brand,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageSidebar,
  SkipToContent,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import accessibleStyles from '@patternfly/react-styles/css/utilities/Accessibility/accessibility';
import { css } from '@patternfly/react-styles';
import gravatarUrl from 'gravatar-url';

import { AuthContext, ProtectedRoute } from '../../Auth';
import imgBrand from '../../resources/logo.png';
import FranchiseComparison from './components/FranchiseComparison';
import Franchises from './components/Franchises';
import Overview from './components/Overview';
import PlayerComparison from './components/PlayerComparison';
import PlayerAnalysis from './components/PlayerAnalysis';
import Players from './components/Players';

const DashboardRoutes = {
  overview: '/dashboard',
  'raw-players': '/dashboard/data/players',
  'raw-franchises': '/dashboard/data/franchises',
  'comparison-players': '/dashboard/comparison/players',
  'comparison-franchises': '/dashboard/comparison/franchises',
  'analysis-player': '/dashboard/analysis/player',
  'analysis-franchise': '/dashboard/analysis/franchise'
};

const RoutesToNavMapping = {
  '/dashboard': {
    activeGroup: null,
    activeItem: 'overview'
  },
  '/dashboard/data/players': {
    activeGroup: 'raw-data',
    activeItem: 'raw-players'
  },
  '/dashboard/data/franchises': {
    activeGroup: 'raw-data',
    activeItem: 'raw-franchises'
  },
  '/dashboard/comparison/players': {
    activeGroup: 'comparison',
    activeItem: 'comparison-players'
  },
  '/dashboard/comparison/franchises': {
    activeGroup: 'comparison',
    activeItem: 'comparison-franchises'
  },
  '/dashboard/analysis/player': {
    activeGroup: 'analysis',
    activeItem: 'analysis-player'
  },
  '/dashboard/analysis/franchise': {
    activeGroup: 'analysis',
    activeItem: 'analysis-franchise'
  }
};

const RoutesToBreadcrumbs = {
  '/dashboard': (
    <Breadcrumb>
      <BreadcrumbItem>Overview</BreadcrumbItem>
      <BreadcrumbItem isActive>Dashboard</BreadcrumbItem>
    </Breadcrumb>
  ),
  '/dashboard/data/players': (
    <Breadcrumb>
      <BreadcrumbItem>Raw Data</BreadcrumbItem>
      <BreadcrumbItem isActive>Players</BreadcrumbItem>
    </Breadcrumb>
  ),
  '/dashboard/data/franchises': (
    <Breadcrumb>
      <BreadcrumbItem>Raw Data</BreadcrumbItem>
      <BreadcrumbItem isActive>Franchises</BreadcrumbItem>
    </Breadcrumb>
  ),
  '/dashboard/comparison/players': (
    <Breadcrumb>
      <BreadcrumbItem>Comparison</BreadcrumbItem>
      <BreadcrumbItem isActive>Players</BreadcrumbItem>
    </Breadcrumb>
  ),
  '/dashboard/comparison/franchises': (
    <Breadcrumb>
      <BreadcrumbItem>Comparison</BreadcrumbItem>
      <BreadcrumbItem isActive>Franchises</BreadcrumbItem>
    </Breadcrumb>
  ),
  '/dashboard/analysis/player': (
    <Breadcrumb>
      <BreadcrumbItem>Analysis</BreadcrumbItem>
      <BreadcrumbItem isActive>Player</BreadcrumbItem>
    </Breadcrumb>
  ),
  '/dashboard/analysis/franchise': (
    <Breadcrumb>
      <BreadcrumbItem>Analysis</BreadcrumbItem>
      <BreadcrumbItem isActive>Franchise</BreadcrumbItem>
    </Breadcrumb>
  )
};

const Dashboard = props => {
  const initialState = {
    isDropdownOpen: false,
    isKebabDropdownOpen: false,
    activeGroup: RoutesToNavMapping[props.location.pathname].activeGroup,
    activeItem: RoutesToNavMapping[props.location.pathname].activeItem,
    alerts: []
  };
  const { state: authState, dispatch } = React.useContext(AuthContext);
  const [data, setData] = React.useState(initialState);

  const onDropdownToggle = isDropdownOpen => {
    setData({
      ...data,
      isDropdownOpen
    });
  };

  const onDropdownSelect = event => {
    event.preventDefault();
    setData({
      ...data,
      isDropdownOpen: !data.isDropdownOpen
    });
  };

  const onKebabDropdownToggle = isKebabDropdownOpen => {
    setData({
      ...data,
      isKebabDropdownOpen
    });
  };

  const onKebabDropdownSelect = event => {
    event.preventDefault();
    setData({
      ...data,
      isKebabDropdownOpen: !data.isKebabDropdownOpen
    });
  };

  const onNavSelect = result => {
    setData({
      ...data,
      activeItem: result.itemId,
      activeGroup: result.groupId
    });
    props.history.push(DashboardRoutes[result.itemId]);
  };

  const onLogout = () => {
    dispatch({
      type: 'LOGOUT'
    });
  };

  const showAlert = (title, variant) => {
    setData({
      ...data,
      alerts: [
        ...data.alerts,
        {
          title,
          variant,
          key: new Date().getTime()
        }
      ]
    });
  };

  const removeAlert = key => {
    setData({
      ...data,
      alerts: [...data.alerts.filter(el => el.key !== key)]
    });
  };

  const PageNav = (
    <Nav onSelect={onNavSelect} aria-label="Nav" theme="dark">
      <NavList>
        <NavItem itemId="overview" isActive={data.activeItem === 'overview'}>
          Overview
        </NavItem>
        <NavExpandable title="Analysis" groupId="analysis" isActive={data.activeGroup === 'analysis'} isExpanded>
          <NavItem groupId="analysis" itemId="analysis-player" isActive={data.activeItem === 'analysis-player'}>
            Player
          </NavItem>
          <NavItem groupId="analysis" itemId="analysis-franchise" isActive={data.activeItem === 'analysis-franchise'}>
            Franchise
          </NavItem>
        </NavExpandable>
        <NavExpandable title="Comparison" groupId="comparison" isActive={data.activeGroup === 'comparison'} isExpanded>
          <NavItem groupId="comparison" itemId="comparison-players" isActive={data.activeItem === 'comparison-players'}>
            Players
          </NavItem>
          <NavItem
            groupId="comparison"
            itemId="comparison-franchises"
            isActive={data.activeItem === 'comparison-franchises'}
          >
            Franchises
          </NavItem>
        </NavExpandable>
        <NavExpandable title="Raw Data" groupId="raw-data" isActive={data.activeGroup === 'raw-data'} isExpanded>
          <NavItem groupId="raw-data" itemId="raw-players" isActive={data.activeItem === 'raw-players'}>
            Players
          </NavItem>
          <NavItem groupId="raw-data" itemId="raw-franchises" isActive={data.activeItem === 'raw-franchises'}>
            Franchises
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  );

  const userDropdownItems = [
    <DropdownItem component="button">Profile</DropdownItem>,
    <DropdownSeparator />,
    <DropdownItem component="button" onClick={onLogout}>
      Logout
    </DropdownItem>
  ];

  const PageToolbar = (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
          <Dropdown
            isPlain
            position="right"
            onSelect={onDropdownSelect}
            isOpen={data.isDropdownOpen}
            toggle={<DropdownToggle onToggle={onDropdownToggle}>{authState.username}</DropdownToggle>}
            dropdownItems={userDropdownItems}
          />
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>
  );

  const Header = (
    <PageHeader
      logo={<Brand src={imgBrand} alt="UIUC CS411" />}
      toolbar={PageToolbar}
      avatar={<Avatar src={gravatarUrl(authState.email, { size: 36 })} alt="Avatar image" />}
      showNavToggle
    />
  );

  const Sidebar = <PageSidebar nav={PageNav} theme="dark" />;

  const pageId = 'main-content-page-layout-expandable-nav';
  const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;

  return (
    <React.Fragment>
      <AlertGroup isToast>
        {data.alerts.map(({ key, variant, title }) => (
          <Alert
            isLiveRegion
            variant={AlertVariant[variant]}
            title={title}
            action={
              <AlertActionCloseButton
                title={title}
                variantLabel={`${variant} alert`}
                onClose={() => removeAlert(key)}
              />
            }
            key={key}
          />
        ))}
      </AlertGroup>
      <Page
        header={Header}
        sidebar={Sidebar}
        isManagedSidebar
        skipToContent={PageSkipToContent}
        breadcrumb={RoutesToBreadcrumbs[props.location.pathname]}
        mainContainerId={pageId}
      >
        <ProtectedRoute path={props.match.path} exact component={Overview} componentProps={{ showAlert }} />
        <ProtectedRoute path={`${props.match.path}/data/players`} component={Players} componentProps={{ showAlert }} />
        <ProtectedRoute
          path={`${props.match.path}/data/franchises`}
          component={Franchises}
          componentProps={{ showAlert }}
        />
        <ProtectedRoute
          path={`${props.match.path}/comparison/players`}
          component={PlayerComparison}
          componentProps={{ showAlert }}
        />
        <ProtectedRoute
          path={`${props.match.path}/comparison/franchises`}
          component={FranchiseComparison}
          componentProps={{ showAlert }}
        />
        <ProtectedRoute
          path={`${props.match.path}/analysis/player`}
          component={PlayerAnalysis}
          componentProps={{ showAlert }}
        />
        {/* <ProtectedRoute
          path={`${props.match.path}/comparison/franchises`}
          component={FranchiseComparison}
          componentProps={{ showAlert }}
        /> */}
      </Page>
    </React.Fragment>
  );
};

export default Dashboard;
