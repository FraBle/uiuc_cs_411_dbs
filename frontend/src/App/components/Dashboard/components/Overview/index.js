import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Flex,
  FlexItem,
  FlexModifiers
} from '@patternfly/react-core';
import DBSizeChart from '../../charts/DBSizeChart';
import LatestFavorites from '../../charts/LatestFavorites';
import PlaceholderChart from '../../charts/PlaceholderChart';

const Overview = () => {
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Overview</Text>
          <Text component="p">Welcome!</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
          <Flex breakpointMods={[{modifier: FlexModifiers["justify-content-space-between"]}]}>
            <FlexItem>
              <Card>
                <CardHeader>DB Size</CardHeader>
                <CardBody>
                  <DBSizeChart />
                </CardBody>
              </Card>
            </FlexItem>
            <FlexItem>
              <Card>
                <CardHeader>Latest Favorites</CardHeader>
                <CardBody><LatestFavorites /></CardBody>
              </Card>
            </FlexItem>
            <FlexItem>
              <Card>
                <CardHeader>Another Chart</CardHeader>
                <CardBody><PlaceholderChart /></CardBody>
              </Card>
            </FlexItem>
          </Flex>
          <Flex breakpointMods={[{modifier: FlexModifiers["justify-content-space-between"]}]}>
            <FlexItem>
              <Card>
                <CardHeader>Another Chart</CardHeader>
                <CardBody><PlaceholderChart /></CardBody>
              </Card>
            </FlexItem>
            <FlexItem>
              <Card>
                <CardHeader>Another Chart</CardHeader>
                <CardBody><PlaceholderChart /></CardBody>
              </Card>
            </FlexItem>
            <FlexItem>
              <Card>
                <CardHeader>Another Chart</CardHeader>
                <CardBody><PlaceholderChart /></CardBody>
              </Card>
            </FlexItem>
          </Flex>
        </Flex>
      </PageSection>
    </React.Fragment>
  );
};

export default Overview;
