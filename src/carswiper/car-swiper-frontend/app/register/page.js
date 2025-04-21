"use client";

import { useState } from "react";
import axios from "axios";
import "./register.css";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/register", formData);
      setMessage("Registration successful!");
    } catch (error) {
      setMessage(error.response?.data?.detail || "An error occurred.");
    }
  };

  return (
    <section className="register-page">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="register-logo"
            src="\logosmall.png"
            alt="logo"
          />
        </a>
        <div className="register-container">
          <div className="register-content">
            <h1 className="register-heading">
              Create an Account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="register-label"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="register-input"
                  placeholder="Username"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="register-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="register-input"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="register-label"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="register-input"
                  required
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="register-button"
              >
                Create an account
              </button>
            </form>
            {message && (
              <p className="register-confirmation">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}