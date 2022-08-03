import React, { useState, useRef } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface TwoFactorAuth {
  handleClose: () => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  handleResend: () => void;
  handle2FaSubmit: () => void;
  authCodeRef: React.MutableRefObject<any>;
}
export default function TwoFactorAuthModal({
  show,
  handleClose,
  setShow,
  handleResend,
  authCodeRef,
  handle2FaSubmit,
}: TwoFactorAuth) {

  return  (
    <div>
      <Dialog open={show} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Authenticate Your Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            An Authentication code has been sent to your email. Please enter the authentication code.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="authcode"
            label="Authentication Code"
            type="text"
            name="authcode"
            ref={authCodeRef}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResend} color="primary">
            Resend
          </Button>
          <Button onClick={handle2FaSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  // return (
  //   <>
  //     <Modal show={show}>
  //       <Modal.Header>
  //         <Modal.Title>Authenticate Your Account</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Container>
  //           <Row>
  //             <Col>
  //             <p> An Authentication code has been sent to your email. Please enter the authentication code </p>
  //             </Col>
  //           </Row>
  //         </Container>
  //         <Form>
  //           <Form.Group>
  //             <Form.Control
  //               type="text"
  //               name="authcode"
  //               ref={authCodeRef}
  //               required
  //             />
  //           </Form.Group>
  //         </Form>
  //       </Modal.Body>
  //       <Modal.Footer>
  //       <Button variant="secondary" onClick={()=> setShow((prev) => !prev)}>
  //           Close
  //         </Button>
  //         <Button variant="secondary" onClick={handleResend}>
  //           Resend
  //         </Button>
  //         <Button variant="primary" onClick={handle2FaSubmit} type="submit">
  //           Submit
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>
  //   </>
  // );
}
