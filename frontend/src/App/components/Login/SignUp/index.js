import React from 'react';
import { Form, FormGroup, TextInput, Modal, Button, ActionGroup } from '@patternfly/react-core';
import EmailValidator from 'email-validator';
import _ from 'lodash';

const initialState = {
  usernameValue: '',
  isValidUsername: true,
  isTakenUsername: false,
  emailValue: '',
  isValidEmail: true,
  isTakenEmail: false,
  passwordValue: '',
  isValidPassword: true
};

const SignUp = props => {
  const [data, setData] = React.useState(initialState);

  const handleUsernameChange = value => {
    setData({
      ...data,
      usernameValue: value,
      isTakenUsername: false,
      isValidUsername: _.size(value) > 0
    });
  };

  const handleEmailChange = value => {
    setData({
      ...data,
      emailValue: value,
      isTakenEmail: false,
      isValidEmail: EmailValidator.validate(value)
    });
  };

  const handlePasswordChange = value => {
    setData({
      ...data,
      passwordValue: value,
      isValidPassword: _.size(value) > 0
    });
  };

  const onSubmit = event => {
    event.preventDefault();
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
        if (res.ok) {
          props.onSuccess();
          return;
        }
        if (resText === 'Error: Username is already taken!') {
          setData({
            ...data,
            isTakenUsername: true
          });
        } else if (resText === 'Error: Email is already in use!') {
          setData({
            ...data,
            isTakenEmail: true
          });
        } else if (resText === 'username has to be alphanumeric, with length between 3 to 20.') {
          setData({
            ...data,
            isValidUsername: false
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onCancel = () => {
    setData({
      ...data,
      usernameValue: '',
      isValidUsername: true,
      isTakenUsername: false,
      emailValue: '',
      isValidEmail: true,
      isTakenEmail: false,
      passwordValue: '',
      isValidPassword: true
    });
    props.onCancel();
  };

  return (
    <Modal isSmall title="Sign Up" isOpen={props.open} onClose={onCancel} isFooterLeftAligned>
      <Form isHorizontal noValidate>
        <FormGroup
          label="Username"
          isRequired
          fieldId="form-username"
          helperTextInvalid={
            data.isTakenUsername
              ? 'Username is already in use 😣'
              : 'Username is not valid (alphanumeric with 3-20 characters) 🧐'
          }
          isValid={data.isTakenUsername ? false : data.isValidUsername}
        >
          <TextInput
            value={data.usernameValue}
            onChange={handleUsernameChange}
            isRequired
            type="text"
            id="form-username"
            name="form-username"
            isValid={data.isTakenUsername ? false : data.isValidUsername}
          />
        </FormGroup>
        <FormGroup
          label="Email"
          isRequired
          fieldId="form-email"
          helperTextInvalid={data.isTakenEmail ? 'Email is already in use 😣' : 'Email is not valid 🧐'}
          isValid={data.isTakenEmail ? false : data.isValidEmail}
        >
          <TextInput
            value={data.emailValue}
            onChange={handleEmailChange}
            isRequired
            type="email"
            id="form-email"
            name="form-email"
            isValid={data.isTakenEmail ? false : data.isValidEmail}
          />
        </FormGroup>
        <FormGroup
          label="Password"
          isRequired
          fieldId="form-password"
          isValid={data.isValidPassword}
          helperTextInvalid={'Password is not valid 🧐'}
        >
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
