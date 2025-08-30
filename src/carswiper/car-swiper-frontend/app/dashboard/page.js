"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css'; // Add this import

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [username, setUsername] = useState("IsaacPrkr"); // Replace with actual user

  useEffect(() => {
    fetchCars();
  }, []);

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

  const currentCar = cars[currentIndex];

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No more cars to swipe!</h1>
          <p className="text-gray-600">Check back later for new cars.</p>
        </div>
      </div>
    );
  }

  if (!currentCar) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">All done!</h1>
          <p className="text-gray-600">You've swiped through all available cars.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden car-card">
        <div className="relative h-96 image-container">
          <img 
            src={currentCar.image_url} 
            alt={`${currentCar.make} ${currentCar.model}`}
            className="w-full h-full object-cover car-image"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 car-info">
            <h2 className="text-white text-2xl font-bold car-title">
              {currentCar.make} {currentCar.model}
            </h2>
            <p className="text-white text-lg car-year">{currentCar.year}</p>
          </div>
        </div>
        
        <div className="p-4 car-content">
          <p className="text-gray-600 mb-4 car-description">{currentCar.description}</p>
          
          <div className="flex justify-center space-x-4 button-container">
            <button
              onClick={() => handleSwipe(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition-colors pass-button"
            >
              Pass ✕
            </button>
            <button
              onClick={() => handleSwipe(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors like-button"
            >
              Like ♥
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-gray-500 counter">
        {currentIndex + 1} / {cars.length}
      </div>
    </div>
  );
}