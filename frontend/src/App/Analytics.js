import React from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';

/*
  If Google Analytics detects that you're running a server locally (e.g. localhost), it automatically sets the cookie_domain to 'none', which will cause gtag.js to set cookies using the full domain from the document location.
*/
ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID, {
  debug: GOOGLE_ANALYTICS_TEST_MODE,
  testMode: GOOGLE_ANALYTICS_TEST_MODE
});

const withGoogleAnalytics = () => {
  let location = useLocation();
  React.useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location]);
};

const trackUser = userId => ReactGA.set({ userId });

const trackEvent = (category, action, label) => ReactGA.event({ category, action, label });

export { withGoogleAnalytics, trackUser, trackEvent };
