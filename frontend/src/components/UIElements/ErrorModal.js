import React from 'react';

import { Button, Modal } from 'react-bootstrap';

const ErrorModal = props => {
  return (
    <Modal
      onHide={props.onClear}
      show={!!props.error}
    >
      <Modal.Header closeButton>
        <Modal.Title>An Error Occurred!</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.error}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClear}>
          Okay
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
