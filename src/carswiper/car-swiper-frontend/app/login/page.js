"use client";

import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", formData);
      setMessage(`Welcome, ${response.data.username}!`);
    } catch (error) {
      setMessage(error.response?.data?.detail || "An error occurred.");
    }
  };

  return (
    <section className="login-page">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="login-logo"
            src="/logosmall.png" 
            alt="logo"
          />
        </a>
        <div className="login-container">
          <div className="login-content">
            <h1 className="login-heading">
              Log In 
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="login-label"
                >
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="login-input"
                  placeholder="Username"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="login-label"
                >
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="login-input"
                  required
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="login-button"
              >
                Log in
              </button>
            </form>
            {message && (
              <p className="text-sm font-light text-red-500 dark:text-red-400">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}