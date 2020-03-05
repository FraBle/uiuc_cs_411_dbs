import React from 'react';
import { LoginFooterItem, LoginForm, LoginMainFooterBandItem, LoginPage, ListItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { UserContext } from '../App';
import SignUp from './SignUp';
import ForgotCredentials from './ForgotCredentials';
import Background from './background.jpg';
import Logo from './logo.png';

export default Login = () => {
  const { dispatch } = React.useContext(AuthContext);
  const initialState = {
    showHelperText: false,
    emailValue: '',
    isValidEmail: true,
    passwordValue: '',
    isValidPassword: true,
    isRememberMeChecked: false,
    isSignUpModalOpen: false,
    isForgotCredentialsModalOpen: false
  };
  const [data, setData] = React.useState(initialState);

  const handleEmailChange = value => {
    setData({
      ...data,
      emailValue: value
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
      isValidEmail: !!data.emailValue,
      isValidPassword: !!data.passwordValue,
      showHelperText: !data.emailValue || !data.passwordValue
    });
    axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        const persons = res.data;
        dispatch({
          type: 'LOGIN',
          payload: persons[0]
        });
      })
      .catch(error => {
        setData({
          ...data,
          isValidEmail: false,
          isValidPassword: false,
          showHelperText: true,
        });
      });
  };

  const toggleSignUpModal = () => {
    setData({
      ...data,
      isSignUpModalOpen: !data.isSignUpModalOpen
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
      <a href="#" onClick={toggleSignUpModal}>
        Sign up.
      </a>
    </LoginMainFooterBandItem>
  );

  const forgotCredentials = (
    <LoginMainFooterBandItem>
      <a href="#" onClick={toggleForgotCredentialsModal}>
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
      <SignUp open={data.isSignUpModalOpen} handler={toggleSignUpModal} />
      <ForgotCredentials open={data.isForgotCredentialsModalOpen} handler={toggleForgotCredentialsModal} />
      <LoginForm
        showHelperText={data.showHelperText}
        helperText={helperText}
        usernameLabel="Email"
        usernameValue={data.emailValue}
        onChangeUsername={handleEmailChange}
        isValidUsername={data.isValidEmail}
        passwordLabel="Password"
        passwordValue={data.passwordValue}
        onChangePassword={handlePasswordChange}
        isValidPassword={data.isValidPassword}
        onLoginButtonClick={onLoginButtonClick}
      />
    </LoginPage>
  );
};

// export default class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showHelperText: false,
//       emailValue: '',
//       isValidEmail: true,
//       passwordValue: '',
//       isValidPassword: true,
//       isRememberMeChecked: false,
//       isSignUpModalOpen: false,
//       isForgotCredentialsModalOpen: false,
//     };

//     this.handleEmailChange = value => {
//       this.setState({ emailValue: value });
//     };

//     this.handlePasswordChange = passwordValue => {
//       this.setState({ passwordValue });
//     };

//     this.onLoginButtonClick = event => {
//       event.preventDefault();
//       this.setState({ isValidEmail: !!this.state.emailValue });
//       this.setState({ isValidPassword: !!this.state.passwordValue });
//       this.setState({ showHelperText: !this.state.emailValue || !this.state.passwordValue });
//     };

//     this.toggleSignUpModal = () => {
//       this.setState(({ isSignUpModalOpen }) => ({
//         isSignUpModalOpen: !isSignUpModalOpen
//       }));
//     };

//     this.toggleForgotCredentialsModal = () => {
//       this.setState(({ isForgotCredentialsModalOpen }) => ({
//         isForgotCredentialsModalOpen: !isForgotCredentialsModalOpen
//       }));
//     };
//   }

//   render() {
//     const helperText = (
//       <React.Fragment>
//         <ExclamationCircleIcon />
//         &nbsp;Invalid login credentials.
//       </React.Fragment>
//     );

//     const signUpForAccountMessage = (
//       <LoginMainFooterBandItem>
//         Need an account?{' '}
//         <a href="#" onClick={this.toggleSignUpModal}>
//           Sign up.
//         </a>
//       </LoginMainFooterBandItem>
//     );
//     const forgotCredentials = (
//       <LoginMainFooterBandItem>
//         <a href="#" onClick={this.toggleForgotCredentialsModal}>
//           Forgot Password?
//         </a>
//       </LoginMainFooterBandItem>
//     );

//     const listItem = (
//       <React.Fragment>
//         <ListItem>
//           <LoginFooterItem href="https://github.com/FraBle/uiuc_cs_411_dbs" target_="_blank">
//             GitHub
//           </LoginFooterItem>
//         </ListItem>
//         <ListItem>
//           <LoginFooterItem href="https://www.kaggle.com/nathanlauga/nba-games" target_="_blank">
//             Data Set
//           </LoginFooterItem>
//         </ListItem>
//         <ListItem>Crafted with ❤ in the Golden State</ListItem>
//       </React.Fragment>
//     );

//     return (
//       <LoginPage
//         footerListVariants="inline"
//         brandImgSrc={Logo}
//         brandImgAlt="UIUC logo"
//         backgroundImgSrc={Background}
//         backgroundImgAlt="Images"
//         footerListItems={listItem}
//         textContent="Our project aims to make the consumption of NBA statistics interactive, easy and fun by combining multiple data sets from Kaggle with public information (e.g. from Wikidata) to create a holistic search interface that visualizes the insights a user might ask about NBA franchises, games, and players through natural language and filter selections."
//         loginTitle="Log in to your account"
//         loginSubtitle="Let The Game Begin!"
//         signUpForAccountMessage={signUpForAccountMessage}
//         forgotCredentials={forgotCredentials}
//       >
//         <SignUp open={this.state.isSignUpModalOpen} handler={this.toggleSignUpModal} />
//         <ForgotCredentials open={this.state.isForgotCredentialsModalOpen} handler={this.toggleForgotCredentialsModal} />
//         <LoginForm
//           showHelperText={this.state.showHelperText}
//           helperText={helperText}
//           usernameLabel="Email"
//           usernameValue={this.state.emailValue}
//           onChangeUsername={this.handleEmailChange}
//           isValidUsername={this.state.isValidEmail}
//           passwordLabel="Password"
//           passwordValue={this.state.passwordValue}
//           onChangePassword={this.handlePasswordChange}
//           isValidPassword={this.state.isValidPassword}
//           onLoginButtonClick={this.onLoginButtonClick}
//         />
//       </LoginPage>
//     );
//   }
// }
