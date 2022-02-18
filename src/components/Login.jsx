import React from "react";
import "./Login.css";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import { useState, useRef } from "react";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";

const Login = ({ setShowLogin, myStorage, setCurrentUsername }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/users/login", user);
      setCurrentUsername(res.data.username);
      myStorage.setItem("user", res.data.username);
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <FmdGoodIcon className="logo-icon" />
        <span>NeshMaps</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={nameRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="login-button" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon
        className="login-cancel"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
};

export default Login;
