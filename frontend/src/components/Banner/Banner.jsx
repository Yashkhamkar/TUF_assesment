import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Banner = () => {
  const [bannerData, setBannerData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const res = await fetch(`/api/banner`);
        const data = await res.json();
        console.log("Fetched data:", data); // Check if data is correct
        setBannerData(data);

        // Calculate time_remaining based on timer_start and current time
        if (data && data.timer_start && data.timer_end) {
          const timerEnd = new Date(data.timer_end).getTime();
          const currentTime = new Date().getTime();
          const timeRemaining = Math.max(0, (timerEnd - currentTime) / 1000); // Time remaining in seconds
          calculateTimeLeft(timeRemaining);
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
    }

    fetchBannerData();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    if (bannerData && bannerData.isVisible === 1 && timeLeft.total > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const updatedTime = prevTimeLeft.total - 1;
          if (updatedTime <= 0) {
            clearInterval(interval);
            return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
          }
          calculateTimeLeft(updatedTime);
          return { ...prevTimeLeft, total: updatedTime };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [bannerData, timeLeft.total]); // Dependencies to track changes

  const calculateTimeLeft = (totalSeconds) => {
    if (totalSeconds <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      return;
    }
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    setTimeLeft({ days, hours, minutes, seconds, total: totalSeconds });
  };

  const handleSignInOut = () => {
    if (isAuthenticated) {
      // Handle sign-out
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      toast.success("Signed out successfully");
      navigate("/"); // Redirect to home page after logout
    } else {
      // Redirect to sign-in page
      navigate("/sign-in");
    }
  };

  const handleEditBanner = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      toast.error("You are not authorized to edit the banner");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="relative flex justify-center items-center h-screen">
      {bannerData && bannerData.isVisible === 1 && timeLeft.total > 0 ? (
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg text-center max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">{bannerData.description}</h2>
          <div className="text-lg font-mono">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
            {timeLeft.seconds}s
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={bannerData.link}
            className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Click here
          </a>
        </div>
      ) : (
        <div className="bg-gray-300 text-black p-6 rounded-lg shadow-lg text-center max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">No active banner</h2>
        </div>
      )}

      {/* Sign In/Out Button */}
      <button
        onClick={handleSignInOut}
        className="absolute top-4 left-32 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        {isAuthenticated ? "Sign Out" : "Sign In"}
      </button>

      {/* Edit Banner Button */}
      <button
        onClick={handleEditBanner}
        className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
      >
        Edit Banner
      </button>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Banner;
