import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import axios from "axios";

const Login = () => {
  const { push } = useHistory();
  const [loading, setLoading] = useState(false);
  const [user, updateUser] = useState({
    username: "",
    password: ""
  })
  const authorizeUser = event => {
    setLoading(true);
    event.preventDefault();
    axios.post("http://localhost:5000/api/login", user).then(response => {
      console.log(response);
      localStorage.setItem("token", JSON.stringify(response.data.payload));
      setLoading(false);
      push("/bubbles");
    })
    .catch(error => {
      console.log(error);
      setLoading(false);
    })
  }
  const handleChanges = event => {
    updateUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }
  return (
    <div className="login">
      <div>
        <h1>Welcome to the Bubble App!</h1>
        <form autoComplete="off" onSubmit={authorizeUser}>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={user.username} onChange={handleChanges}/>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={user.password} onChange={handleChanges}/>
          </div>
          {loading ? <div>Loading...</div>  : <button type="submit">Log In</button>}
        </form>
      </div>
    </div>
  );
};

export default Login;
