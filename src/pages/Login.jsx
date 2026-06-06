import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log("Login Response:", res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

      toast.success("Login Successful");  

      navigate("/dashboard");

    } catch (error) {

  console.log("FULL ERROR:", error);

  console.log("SERVER RESPONSE:", error.response?.data);

 toast.error( 
      error.response?.data?.message || "Login Failed"
    );
}
  };

  return (
  <div className="auth-container">

    <div className="auth-card">

      <h1>💰 Expense Tracker</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} autoComplete="off">

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="off"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

      <p>
        Don't have an account?
        <a href="/register"> Register</a>
      </p>

    </div>

  </div>
);

        
}

export default Login;