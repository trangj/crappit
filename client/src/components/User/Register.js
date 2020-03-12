import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";

const Register = ({ registerUser }) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    const user = {
      username,
      email,
      password
    };
    registerUser(user);
    setUsername("");
    setEmail("");
    setPassword("");
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} color="inherit">
        Register
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">Register</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
              label="Username"
            />
            <TextField
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              label="Email"
            />
            <TextField
              id="password"
              value={password}
              type="password"
              onChange={e => setPassword(e.target.value)}
              fullWidth
              label="Password"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Register;
