import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export const Login = ({ setAuthUser }) => {
  const [loginUser, setLoginUser] = useState({ email: "" });
  const [existDialog, setExistDialog] = useState(false);

  const navigate = useNavigate();

  // everytime after accepting an input, set the state
  const handleInputChange = (event) => {
    const newUser = { ...loginUser };
    newUser[event.target.id] = event.target.value;
    setLoginUser(newUser);
  };

  const existingUserCheck = () => {
    // If your json-server URL is different, please change it below!
    return fetch(`http://localhost:8088/users?email=${loginUser.email}`)
      .then((res) => res.json())
      .then((user) => (user.length ? user[0] : false));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    existingUserCheck().then((exists) => {
      if (exists) {
        // The user id is saved under the key gallery_user in session Storage. Change below if needed!
        setAuthUser(exists);
        navigate("/galleries");
      } else {
        setExistDialog(true);
      }
    });
  };

  return (
    <section className="vh-100 bg-image" >
      <div className="mask d-flex align-items-center h-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-12 col-lg-12 col-xl-6">
              <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                {/* <h2 className="text-uppercase text-center mt-5">Sign In</h2> */}
                <dialog className="dialog dialog--auth" style={{ borderRadius: '0.5rem' }} open={existDialog}>
                  <div>Entered user does not exist. Please try again.</div>
                  <br></br>
                  <button
                    className="button--close btn btn-primary"
                    onClick={(e) => setExistDialog(false)}
                  >
                    Close
                  </button>
                </dialog>
                <div className="card-body p-5 text-center" style={{ display: 'flex' }}>

                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Email address"
                    required
                    autoFocus
                    value={loginUser.email}
                    onChange={handleInputChange}
                  /> &nbsp;&nbsp;&nbsp;
                  <button className="btn btn-primary btn-lg btn-block" style={{ width: 200 }} type="submit" onClick={handleLogin}>Sign in</button>
                </div>
                <div className="card-body p-2 mb-5 text-center">
                  <section className="link--register">
                    Not a member yet? <Link to="/register">Register</Link>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
