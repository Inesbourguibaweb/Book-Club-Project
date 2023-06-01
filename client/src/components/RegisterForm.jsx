import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';

const RegisterForm = ({ setIsLoggedIn }) => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const changeHandler = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };
// Validations of inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate firstName
    if (!userInfo.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    } else if (userInfo.firstName.length < 2) {
      newErrors.firstName = 'First Name must be greater than 2 characters';
      isValid = false;
    }

    // Validate lastName
    if (!userInfo.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    } else if (userInfo.lastName.length < 2) {
      newErrors.lastName = 'Last Name must be greater than 2 characters';
      isValid = false;
    }

    // Validate email
    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Validate password
    if (!userInfo.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (userInfo.password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters long';
      isValid = false;
    }

    // Validate confirmPassword
    if (!userInfo.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (userInfo.password !== userInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
// Function to submit registration inputs
  const submitHandler = (e) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post('http://localhost:8000/api/users/register', userInfo, { withCredentials: true })
        .then((res) => {
          console.log(res.data);
          dispatch({
            type: 'SET_USER',
            payload: res.data.user,
          });
          setIsLoggedIn(true);
          navigate('/books');
        })
        .catch((err) => {
          setErrors({ serverError: err.response.data});
        });
    }
  };

  return (
    <div className="col-md-5 offset-1 bg-info-subtle rounded-3 border border-primary-subtle g-2">
      <form onSubmit={submitHandler}>
        <h3 className="text-center">Register</h3>
        <div className="form-group">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={userInfo.firstName}
            onChange={changeHandler}
            
          />
          {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={userInfo.lastName}
            onChange={changeHandler}
            
          />
          {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={userInfo.email}
            onChange={changeHandler}
           
          />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={userInfo.password}
            onChange={changeHandler}
            
          />
          {errors.password && <p className="text-danger">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={userInfo.confirmPassword}
            onChange={changeHandler}
            
          />
          {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
        </div>
        <div className="form-group">
          {errors.serverError && <p className="text-danger">{errors.serverError}</p>}
          <button type="submit" className="btn btn-primary mt-3">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
