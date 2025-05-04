"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "./home.css";

export default function Home() {
  const router = useRouter();

  const handleAccessCarSwiper = () => {
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="home-page">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          {/* Left Side: Welcome Message and Access Button */}
          <div className="home-container">
            <form className="home-content">
              <div className="mb-12">
                <h1 className="home-heading">Welcome to Car Swiper</h1>
                <p className="home-description">
                Car Swiper is a web application created for car enthusiasts. Connect with a community of individuals who share your passion for cars, showcase your vehicle, and engage in meaningful conversations. Whether you're looking to share your experiences, discover unique cars, or build lasting friendships, Car Swiper provides the perfect platform to celebrate your love for cars and expand your network.
                </p>
              </div>

              <div className="!mt-12">
                <button
                  type="button"
                  className="home-button"
                  onClick={handleAccessCarSwiper}
                >
                  Access CarSwiper
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Image */}
          <div className="max-md:mt-8">
            <img
              src="/logosmall.png"
              className="home-image"
              alt="home img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}