import React from 'react';
import {
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
  PageSection,
  PageSectionVariants,
  PageSidebar,
  SkipToContent,
  TextContent,
  Text,
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

const Dashboard = () => {
  const initialState = {
    isDropdownOpen: false,
    isKebabDropdownOpen: false,
    activeGroup: 'players',
    activeItem: 'players-overview'
  };
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
  };

  const PageNav = (
    <Nav onSelect={onNavSelect} aria-label="Nav" theme="dark">
      <NavList>
        <NavExpandable title="Players" groupId="players" isActive={data.activeGroup === 'players'} isExpanded>
          <NavItem groupId="players" itemId="overview" isActive={data.activeItem === 'players-overview'}>
            Overview
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
    <DropdownItem component="button">More</DropdownItem>
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
            toggle={<DropdownToggle onToggle={onDropdownToggle}>User</DropdownToggle>}
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
      <Page
        header={Header}
        sidebar={Sidebar}
        isManagedSidebar
        skipToContent={PageSkipToContent}
        breadcrumb={PageBreadcrumb}
        mainContainerId={pageId}
      >
        <Players />
      </Page>
    </React.Fragment>
  );
};

export default Dashboard;
