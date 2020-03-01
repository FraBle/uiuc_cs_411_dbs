import React from 'react';
// import brandImg from './brandImgColor.svg';
import {
  LoginFooterItem,
  LoginForm,
  LoginMainFooterBandItem,
  LoginMainFooterLinksItem,
  LoginPage,
  BackgroundImageSrc,
  ListItem
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import Background from './background.jpg';
import Logo from './logo.png';
import SignUp from './SignUp';
import ForgotCredentials from './ForgotCredentials';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelperText: false,
      emailValue: '',
      isValidEmail: true,
      passwordValue: '',
      isValidPassword: true,
      isRememberMeChecked: false,
      isSignUpModalOpen: false,
      isForgotCredentialsModalOpen: false,
    };

    this.handleEmailChange = value => {
      this.setState({ emailValue: value });
    };

    this.handlePasswordChange = passwordValue => {
      this.setState({ passwordValue });
    };

    this.onLoginButtonClick = event => {
      event.preventDefault();
      this.setState({ isValidEmail: !!this.state.emailValue });
      this.setState({ isValidPassword: !!this.state.passwordValue });
      this.setState({ showHelperText: !this.state.emailValue || !this.state.passwordValue });
    };

    this.toggleSignUpModal = () => {
      this.setState(({ isSignUpModalOpen }) => ({
        isSignUpModalOpen: !isSignUpModalOpen
      }));
    };

    this.toggleForgotCredentialsModal = () => {
      this.setState(({ isForgotCredentialsModalOpen }) => ({
        isForgotCredentialsModalOpen: !isForgotCredentialsModalOpen
      }));
    };
  }

  render() {
    const helperText = (
      <React.Fragment>
        <ExclamationCircleIcon />
        &nbsp;Invalid login credentials.
      </React.Fragment>
    );

    const signUpForAccountMessage = (
      <LoginMainFooterBandItem>
        Need an account?{' '}
        <a href="#" onClick={this.toggleSignUpModal}>
          Sign up.
        </a>
      </LoginMainFooterBandItem>
    );
    const forgotCredentials = (
      <LoginMainFooterBandItem>
        <a href="#" onClick={this.toggleForgotCredentialsModal}>
          Forgot Password?
        </a>
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
        forgotCredentials={forgotCredentials}
      >
        <SignUp open={this.state.isSignUpModalOpen} handler={this.toggleSignUpModal} />
        <ForgotCredentials open={this.state.isForgotCredentialsModalOpen} handler={this.toggleForgotCredentialsModal} />
        <LoginForm
          showHelperText={this.state.showHelperText}
          helperText={helperText}
          usernameLabel="Email"
          usernameValue={this.state.emailValue}
          onChangeUsername={this.handleEmailChange}
          isValidUsername={this.state.isValidEmail}
          passwordLabel="Password"
          passwordValue={this.state.passwordValue}
          onChangePassword={this.handlePasswordChange}
          isValidPassword={this.state.isValidPassword}
          onLoginButtonClick={this.onLoginButtonClick}
        />
      </LoginPage>
    );
  }
}
