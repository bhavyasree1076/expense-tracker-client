import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      toast.success(res.data.message || "Registration Successful");

      navigate("/");

    } catch (error) {

     toast.error(
  error.response?.data?.message || "Registration Failed"
);
    }

  };
    return (

  <div className="auth-container">

    <div className="auth-card">

      <h1>💰 Expense Tracker</h1>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit} autoComplete="off">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          autoComplete="name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          onChange={handleChange}
          required
        />

        <button type="submit">
          Register
        </button>

      </form>

      <p>
        Already have an account?
        <a href="/"> Login</a>
      </p>

    </div>

  </div>

);
  

}

export default Register;