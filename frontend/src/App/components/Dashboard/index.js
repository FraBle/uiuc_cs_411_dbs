import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertVariant,
  AlertActionCloseButton,
  Brand,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
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
// make sure you've installed @patternfly/patternfly
import accessibleStyles from '@patternfly/react-styles/css/utilities/Accessibility/accessibility';
import spacingStyles from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import { css } from '@patternfly/react-styles';
import { BellIcon, CogIcon } from '@patternfly/react-icons';
import imgBrand from '../../resources/logo.png';
// import imgAvatar from '../../resources/avatar.svg';
import Players from './components/Players';
import Overview from './components/Overview';
import { AuthContext, ProtectedRoute } from '../../Auth';
import { Route } from 'react-router-dom';

const DashboardRoutes = {
  overview: '/dashboard',
  'raw-players': '/dashboard/data/players'
};

const Dashboard = (props) => {
  const initialState = {
    isDropdownOpen: false,
    isKebabDropdownOpen: false,
    activeGroup: null,
    activeItem: 'overview',
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
      isDropdownOpen: !data.isDropdownOpen,
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
      isKebabDropdownOpen: !data.isKebabDropdownOpen,
    });
  };

  const onNavSelect = result => {
    setData({
      ...data,
      activeItem: result.itemId,
      activeGroup: result.groupId,
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
        <NavExpandable title="Raw Data" groupId="raw-data" isActive={data.activeGroup === 'raw-data'} isExpanded>
          <NavItem groupId="raw-data" itemId="raw-players" isActive={data.activeItem === 'raw-players'}>
            Players
          </NavItem>
          {/* <NavItem groupId="players" itemId="More" isActive={data.activeItem === 'More'}>
            More (N/A)
          </NavItem> */}
        </NavExpandable>
        {/* <NavExpandable title="Franchises" groupId="franchises" isActive={data.activeGroup === 'franchises'}>
          <NavItem
            groupId="franchises"
            itemId="franchises-overview"
            isActive={data.activeItem === 'franchises-overview'}
          >
            Overview
          </NavItem>
          <NavItem groupId="franchises" itemId="franchises_itm-2" isActive={data.activeItem === 'franchises-more'}>
            More (N/A)
          </NavItem>
        </NavExpandable> */}
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
      // avatar={<Avatar src={imgAvatar} alt="Avatar image" />}
      showNavToggle
    />
  );

  const Sidebar = <PageSidebar nav={PageNav} theme="dark" />;

  const PageBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem>Players</BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>Overview</BreadcrumbItem>
    </Breadcrumb>
  );

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
        breadcrumb={PageBreadcrumb}
        mainContainerId={pageId}
      >
        {/* <ProtectedRoute path={props.match.path} exact component={Overview} /> */}
        <ProtectedRoute path={props.match.path} exact component={Overview} componentProps={{ showAlert }} />
        <ProtectedRoute path={`${props.match.path}/data/players`} component={Players} componentProps={{ showAlert }} />
      </Page>
    </React.Fragment>
  );
};

export default Dashboard;
