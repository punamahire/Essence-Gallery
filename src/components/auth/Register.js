import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export const Register = () => {
  const [registerUser, setRegisterUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [conflictDialog, setConflictDialog] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const newUser = { ...registerUser };
    newUser[event.target.id] = event.target.value;
    setRegisterUser(newUser);
  };

  const existingUserCheck = () => {
    // If your json-server URL is different, please change it below!
    return fetch(`http://localhost:8088/users?email=${registerUser.email}`)
      .then((res) => res.json())
      .then((user) => !!user.length);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    existingUserCheck().then((userExists) => {
      if (!userExists) {
        // If your json-server URL is different, please change it below!
        fetch("http://localhost:8088/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: registerUser.email,
            name: `${registerUser.firstName} ${registerUser.lastName}`,
          }),
        })
          .then((res) => res.json())
          .then((createdUser) => {
            if (createdUser.hasOwnProperty("id")) {
              // The user id is saved under the key gallery_user in session Storage. Change below if needed!
              sessionStorage.setItem("gallery_user", createdUser.id);
              navigate("/");
            }
          });
      } else {
        setConflictDialog(true);
      }
    });
  };

  return (
    <section className="vh-100 bg-image">
      <div className="mask d-flex align-items-center h-100 gradient-custom">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: 15 }}>

                <dialog className="dialog dialog--auth" style={{ borderRadius: '0.5rem' }} open={conflictDialog}>
                  <div>User already exists. Please login.</div>
                  <br></br>
                  <button
                    className="button--close btn btn-primary"
                    onClick={(e) => setConflictDialog(false)}
                  >
                    Close
                  </button>
                </dialog>

                <div className="card-body p-5">
                  {/* <h2 className="text-uppercase text-center mb-5">Create an account</h2> */}
                  <form className="form--login" onSubmit={handleRegister}>
                    <div className="form-outline mb-4">
                      <label className="form-label label-font-size" htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        className="form-control form-control-lg"
                        placeholder="Enter first name"
                        required
                        autoFocus
                        value={registerUser.firstName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label label-font-size" htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        className="form-control form-control-lg"
                        placeholder="Enter last name"
                        required
                        value={registerUser.lastName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label label-font-size" htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder="Enter email address"
                        required
                        value={registerUser.email}
                        autoComplete={'false'}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="d-flex justify-content-center">
                      <button type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom text-body">Register</button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">Already have an account? <Link to="/login"><u>Login here</u></Link></p>

                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
