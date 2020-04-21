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
            <Card isHoverable style={{ minHeight: '22em' }}>
              <CardHeader>DB Size</CardHeader>
              <CardBody>
                <DBSizeChart />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '22em' }}>
              <CardHeader>Latest Favorites</CardHeader>
              <CardBody>
                <LatestFavorites showAlert={props.showAlert} />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '22em' }}>
              <CardHeader>Another Chart</CardHeader>
              <CardBody>
                <PlaceholderChart />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '22em' }}>
              <CardHeader>Another Chart</CardHeader>
              <CardBody>
                <PlaceholderChart />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '22em' }}>
              <CardHeader>Another Chart</CardHeader>
              <CardBody>
                <PlaceholderChart />
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isHoverable style={{ minHeight: '22em' }}>
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
