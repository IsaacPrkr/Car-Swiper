"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchCars();
    }
  }, [username]);

  const fetchCars = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/cars/swipeable?username=${username}`);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleSwipe = async (liked) => {
    if (currentIndex >= cars.length) return;
    
    const currentCar = cars[currentIndex];
    
    try {
      await axios.post(`http://localhost:8000/cars/swipe?username=${username}`, {
        car_id: currentCar.id,
        liked: liked
      });
      
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error("Error recording swipe:", error);
    }
  };

  if (!username) {
    return (
      <div className="loading-container">
        <div className="message-box">
          <h1 className="message-title">Loading...</h1>
          <p className="message-text">Please log in first.</p>
        </div>
      </div>
    );
  }

  const currentCar = cars[currentIndex];

  if (cars.length === 0) {
    return (
      <div className="no-cars-container">
        <div className="message-box">
          <h1 className="message-title">No more cars to swipe!</h1>
          <p className="message-text">Check back later for new cars.</p>
        </div>
      </div>
    );
  }

  if (!currentCar) {
    return (
      <div className="no-cars-container">
        <div className="message-box">
          <h1 className="message-title">All done!</h1>
          <p className="message-text">You've swiped through all available cars.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-background">
      <div className="car-card">
        <div className="image-container">
          <img 
            src={currentCar.image_url} 
            alt={`${currentCar.make} ${currentCar.model}`}
            className="car-image"
          />
          <div className="car-info">
            <h2 className="car-title">
              {currentCar.make} {currentCar.model}
            </h2>
            <p className="car-year">{currentCar.year}</p>
          </div>
        </div>
        
        <div className="car-content">
          <p className="car-description">{currentCar.description}</p>
          
          <div className="button-container">
            <button
              onClick={() => handleSwipe(false)}
              className="pass-button"
            >
              Pass ✕
            </button>
            <button
              onClick={() => handleSwipe(true)}
              className="like-button"
            >
              Like ♥
            </button>
          </div>
        </div>
      </div>
      
      <div className="counter">
        {currentIndex + 1} / {cars.length}
      </div>
    </div>
  );
}