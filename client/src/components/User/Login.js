import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";

const Login = ({ loginUser }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    const user = {
      email,
      password
    };
    loginUser(user);
    setEmail("");
    setPassword("");
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} color="inherit">
        Login
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="title">Login</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              label="Email"
            />
            <TextField
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              label="Password"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
