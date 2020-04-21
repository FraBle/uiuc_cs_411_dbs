import React from 'react';
import { Form, FormGroup, TextInput, Modal, Button, ActionGroup } from '@patternfly/react-core';

export default class ForgotCredentials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ''
    };

    this.handleEmailChange = email => {
      this.setState({ email });
    };

    this.handleSubmit = () => {
      console.log(`Submit ${JSON.stringify(this.state)}`);
      this.props.handler();
    };

    this.handleCancel = () => {
      console.log(`Cancel ${JSON.stringify(this.state)}`);
      this.props.handler();
    };
  }
  render() {
    const { email } = this.state;
    return (
      <Modal isSmall title="Sign Up" isOpen={this.props.open} onClose={this.props.handler} isFooterLeftAligned>
        <Form isHorizontal>
          <FormGroup label="Email" isRequired fieldId="form-email">
            <TextInput
              value={email}
              onChange={this.handleEmailChange}
              isRequired
              type="email"
              id="form-email"
              name="form-email"
            />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
            <Button variant="secondary" onClick={this.handleCancel}>
              Cancel
            </Button>
          </ActionGroup>
        </Form>
      </Modal>
    );
  }
}
