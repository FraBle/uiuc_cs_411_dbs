import React from 'react';
import { Form, FormGroup, TextInput, Modal, Button, ActionGroup } from '@patternfly/react-core';
import { AuthContext } from '../../../Auth';

const SignUp = props => {
  const { dispatch } = React.useContext(AuthContext);
  const initialState = {
    usernameValue: '',
    isValidUsername: true,
    emailValue: '',
    isValidEmail: true,
    passwordValue: '',
    isValidPassword: true,
    signedUpSuccessfully: false
  };
  const [data, setData] = React.useState(initialState);

  const handleUsernameChange = value => {
    setData({
      ...data,
      usernameValue: value
    });
  };

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

  const onSubmit = event => {
    event.preventDefault();
    setData({
      ...data,
      isValidUsername: !!data.usernameValue,
      isValidEmail: !!data.isValidEmail,
      isValidPassword: !!data.passwordValue
    });
    if (!data.isValidUsername || !data.isValidEmail || !data.isValidPassword) return;
    fetch(`${BACKEND}/api/auth/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.usernameValue,
        email: data.emailValue,
        password: data.passwordValue
      })
    })
      .then(res => {
        return Promise.all([res, res.text()]);
      })
      .then(([res, resText]) => {
        console.log(res);
        console.log(resText);
        if (res.ok) {
          setData({
            ...data,
            signedUpSuccessfully: true,
            isValidUsername: true,
            isValidEmail: true,
            isValidPassword: true
          });
          props.handler(true);
        }
        if (resText === 'Error: Username is already taken!') {
          setData({
            ...data,
            signedUpSuccessfully: false,
            isValidUsername: false
          });
        } else if (resText === 'Error: Email is already in use!') {
          setData({
            ...data,
            signedUpSuccessfully: false,
            isValidEmail: false
          });
        }
      })
      .catch(error => {
        setData({
          ...data,
          isValidUsername: false,
          isValidEmail: false,
          isValidPassword: false
        });
      });
  };

  const onCancel = () => {
    setData({
      ...data,
      usernameValue: '',
      isValidUsername: true,
      emailValue: '',
      isValidEmail: true,
      passwordValue: '',
      isValidPassword: true,
      signedUpSuccessfully: false
    });
    props.handler(false);
  };

  return (
    <Modal isSmall title="Sign Up" isOpen={props.open} onClose={() => props.handler(false)} isFooterLeftAligned>
      <Form isHorizontal noValidate>
        <FormGroup
          label="Username"
          isRequired
          fieldId="form-username"
          helperTextInvalid="Username is already taken :("
          isValid={data.isValidUsername}
        >
          <TextInput
            value={data.usernameValue}
            onChange={handleUsernameChange}
            isRequired
            type="text"
            id="form-username"
            name="form-username"
            isValid={data.isValidUsername}
          />
        </FormGroup>
        <FormGroup
          label="Email"
          isRequired
          fieldId="form-email"
          helperTextInvalid="Email is already in use :("
          isValid={data.isValidEmail}
        >
          <TextInput
            value={data.emailValue}
            onChange={handleEmailChange}
            isRequired
            type="email"
            id="form-email"
            name="form-email"
            isValid={data.isValidEmail}
          />
        </FormGroup>
        <FormGroup label="Password" isRequired fieldId="form-password" isValid={data.isValidPassword}>
          <TextInput
            value={data.passwordValue}
            onChange={handlePasswordChange}
            isRequired
            type="password"
            id="form-password"
            name="form-password"
            isValid={data.isValidPassword}
          />
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" type="submit" onClick={onSubmit}>
            Submit
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};

export default SignUp;
