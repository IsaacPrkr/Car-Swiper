"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./register.css";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // Tracks if the message is an error
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/register", formData);
      setMessage("Registration successful!");
      setIsError(false); // Success message
    } catch (error) {
      setMessage(error.response?.data?.detail || "An error occurred.");
      setIsError(true); // Error message
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="register-page">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          {/* Left Side: Register Form */}
          <div className="register-container">
            <form className="register-content" onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="register-heading">Create an Account</h3>
                <p className="register-description">
                  Register for a Car-Swiper account here!
                </p>
              </div>

              <div>
                <label className="register-label" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="register-input"
                  placeholder="Enter username"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="register-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="register-input"
                  placeholder="Enter email"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="register-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="register-input"
                  placeholder="Enter password"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Registration Message */}
              {message && (
                <div
                  className={`register-confirmation ${
                    isError ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="!mt-12">
                <button type="submit" className="register-button">
                  Create an account
                </button>
                <p className="text-sm !mt-6 text-center text-slate-500">
                  Already have an account?
                  <a
                    href="#"
                    onClick={handleLoginRedirect}
                    className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Right Side: Image */}
          <div className="max-md:mt-8">
            <img
              src="/logosmall.png"
              className="register-image"
              alt="register img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}