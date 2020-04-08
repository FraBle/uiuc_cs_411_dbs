import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Button,
  LoginFooterItem,
  LoginForm,
  LoginMainFooterBandItem,
  LoginPage,
  ListItem
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { AuthContext } from '../../Auth';
import { Redirect } from 'react-router-dom';
import SignUp from './SignUp';
import ForgotCredentials from './ForgotCredentials';
import Background from '../../resources/background.jpg';
import Logo from '../../resources/logo.png';

const Login = (props) => {
  const { state: authState, dispatch } = React.useContext(AuthContext);
  const initialState = {
    showHelperText: false,
    usernameValue: '',
    isValidUsername: true,
    passwordValue: '',
    isValidPassword: true,
    isRememberMeChecked: false,
    isSignUpModalOpen: false,
    isForgotCredentialsModalOpen: false,
    alerts: []
  };
  const [data, setData] = React.useState(initialState);

  const handleUsernameChange = value => {
    setData({
      ...data,
      usernameValue: value
    });
  };

  const handlePasswordChange = value => {
    setData({
      ...data,
      passwordValue: value
    });
  };

  const onLoginButtonClick = event => {
    event.preventDefault();
    setData({
      ...data,
      isValidUsername: !!data.usernameValue,
      isValidPassword: !!data.passwordValue,
      showHelperText: !data.usernameValue || !data.passwordValue
    });
    if (!data.isValidUsername || !data.isValidPassword) return;
    fetch(`${BACKEND}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.usernameValue,
        password: data.passwordValue
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(resJson => {
        dispatch({
          type: 'LOGIN',
          payload: resJson
        });
      })
      .then(() => {
        props.history.push('/');
      })
      .catch(error => {
        setData({
          ...data,
          isValidUsername: false,
          isValidPassword: false,
          showHelperText: true
        });
      });
  };

  const toggleSignUpModal = (success) => {
    setData({
      ...data,
      isSignUpModalOpen: !data.isSignUpModalOpen,
      alerts: success ? [...data.alerts, { title: 'Successfully Signed Up! 🚀', variant: 'success', key: new Date().getTime() }] : data.alerts
    });
  };

  const toggleForgotCredentialsModal = () => {
    setData({
      ...data,
      isForgotCredentialsModalOpen: !data.isForgotCredentialsModalOpen
    });
  };

  const helperText = (
    <React.Fragment>
      <ExclamationCircleIcon />
      &nbsp;Invalid login credentials.
    </React.Fragment>
  );

  const signUpForAccountMessage = (
    <LoginMainFooterBandItem>
      Need an account?{' '}
      <Button variant="link" isInline onClick={() => toggleSignUpModal(false)}>
        Sign up.
      </Button>
    </LoginMainFooterBandItem>
  );

  const forgotCredentials = (
    <LoginMainFooterBandItem>
      <Button variant="link" isInline onClick={toggleForgotCredentialsModal}>
        Forgot Password?
      </Button>
    </LoginMainFooterBandItem>
  );

  const listItem = (
    <React.Fragment>
      <ListItem>
        <LoginFooterItem href="https://github.com/FraBle/uiuc_cs_411_dbs" target_="_blank">
          GitHub
        </LoginFooterItem>
      </ListItem>
      <ListItem>
        <LoginFooterItem href="https://www.kaggle.com/nathanlauga/nba-games" target_="_blank">
          Data Set
        </LoginFooterItem>
      </ListItem>
      <ListItem>Crafted with ❤ in the Golden State</ListItem>
    </React.Fragment>
  );

  const addAlert = (title, variant) => {
    setData({
      ...data,
      alerts: [...data.alerts, {title, variant, key: new Date().getTime()}]
    });
  }

  const removeAlert = (key) => {
    setData({
      ...data,
      alerts: [...data.alerts.filter(el => el.key !== key)]
    });
  };

  return (
    <LoginPage
      footerListVariants="inline"
      brandImgSrc={Logo}
      brandImgAlt="UIUC logo"
      backgroundImgSrc={Background}
      backgroundImgAlt="Images"
      footerListItems={listItem}
      textContent="Our project aims to make the consumption of NBA statistics interactive, easy and fun by combining multiple data sets from Kaggle with public information (e.g. from Wikidata) to create a holistic search interface that visualizes the insights a user might ask about NBA franchises, games, and players through natural language and filter selections."
      loginTitle="Log in to your account"
      loginSubtitle="Let The Game Begin!"
      signUpForAccountMessage={signUpForAccountMessage}
      // forgotCredentials={forgotCredentials}
    >
      <SignUp open={data.isSignUpModalOpen} handler={toggleSignUpModal} />
      {/* <ForgotCredentials open={data.isForgotCredentialsModalOpen} handler={toggleForgotCredentialsModal} /> */}
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
      <LoginForm
        showHelperText={data.showHelperText}
        helperText={helperText}
        usernameLabel="Username"
        usernameValue={data.usernameValue}
        onChangeUsername={handleUsernameChange}
        isValidUsername={data.isValidUsername}
        passwordLabel="Password"
        passwordValue={data.passwordValue}
        onChangePassword={handlePasswordChange}
        isValidPassword={data.isValidPassword}
        onLoginButtonClick={onLoginButtonClick}
      />
    </LoginPage>
  );
};

export default Login;
