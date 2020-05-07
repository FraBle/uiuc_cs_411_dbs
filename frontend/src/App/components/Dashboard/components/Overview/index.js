import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  TextVariants,
  Gallery,
  GalleryItem
} from '@patternfly/react-core';
import DBSizeChart from '../../charts/DBSizeChart';
import LatestFavorites from '../../charts/LatestFavorites';
import Top10Chart from '../../charts/Top10Chart';
import PlaceholderChart from '../../charts/PlaceholderChart';

const Overview = props => {
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>Overview: Dashboard</Text>
          <Text component={TextVariants.p}>
            Welcome to NBA Analytics - A project for CS 411 (Database Systems) at UIUC!
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Gallery gutter="sm">
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '26rem' }}>
              <CardHeader>DB Size</CardHeader>
              <CardBody>
                <DBSizeChart />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '26rem' }}>
              <CardHeader>Latest Favorites</CardHeader>
              <CardBody>
                <LatestFavorites showAlert={props.showAlert} />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '26rem' }}>
              <CardHeader>Top 10 Players by Points</CardHeader>
              <CardBody>
                <Top10Chart showAlert={props.showAlert} type="player" category="points" />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '26rem' }}>
              <CardHeader>Top 10 Players by Field Goals</CardHeader>
              <CardBody>
                <Top10Chart showAlert={props.showAlert} type="player" category="fieldGoalsMade" />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '26rem' }}>
              <CardHeader>Top 10 Franchises by Points</CardHeader>
              <CardBody>
                <Top10Chart showAlert={props.showAlert} type="franchise" category="points" />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '26rem' }}>
              <CardHeader>Another Chart</CardHeader>
              <CardBody>
                <PlaceholderChart />
              </CardBody>
            </Card>
          </GalleryItem>
        </Gallery>
      </PageSection>
    </React.Fragment>
  );
};

export default Overview;
