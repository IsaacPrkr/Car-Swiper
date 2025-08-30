"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./login.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(""); // Message for login success or failure
  const [isError, setIsError] = useState(false); // Tracks if the message is an error
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", formData);

      localStorage.setItem('username', formData.username);

      setMessage("Login successful! Redirecting...");
      setIsError(false); // Success message
      setTimeout(() => {
        router.push("/dashboard"); // Redirect to dashboard after successful login
      }, 1000);
    } catch (error) {
      setMessage("Failed login: Incorrect username or password."); // Error message
      setIsError(true);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  return (
    <div className="login-page">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          {/* Left Side: Login Form */}
          <div className="login-container">
            <form className="login-content" onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="login-heading">Sign in</h3>
                <p className="login-description">
                  Sign into your Car-Swiper account here.
                </p>
              </div>

              <div>
                <label className="login-label">User name</label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    required
                    className="login-input"
                    placeholder="Enter username"
                    onChange={handleChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div>
                <label className="login-label">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    className="login-input"
                    placeholder="Enter password"
                    onChange={handleChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="login-input-icon"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Login Message */}
              {message && (
                <div
                  className={`login-message ${
                    isError ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="!mt-12">
                <button
                  type="submit"
                  className="login-button"
                >
                  Sign in
                </button>
                <p className="text-sm !mt-6 text-center text-slate-500">
                  Don't have an account
                  <a
                    href="#"
                    onClick={handleRegisterRedirect}
                    className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
                  >
                    Register here
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Right Side: Image */}
          <div className="max-md:mt-8">
            <img
              src="/logosmall.png"
              className="login-image"
              alt="login img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}