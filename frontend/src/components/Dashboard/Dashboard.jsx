import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState({
    description: "",
    link: "",
    isVisible: false,
    timer_start: "",
    timer_end: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("/api/banner", {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header
          },
        });
        const data = await res.json(); // Ensure response is parsed as JSON

        if (res.ok && data) {
          // Check if response is successful and data is available
          if (data.message) {
            setIsUpdate(false); // No banner exists, set to create mode
          } else {
            setBannerData({
              ...data,
              timer_start: data.timer_start || "",
              timer_end: data.timer_end || "",
            });
            setIsUpdate(true); // Banner exists, set to update mode
          }
        } else {
          // Handle case where response is not ok
          console.error("Failed to fetch banner data");
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    fetchBannerData();
  }, []);

  const handleChange = (e) => {
    setBannerData({
      ...bannerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate time_remaining based on timer_start and timer_end
    const now = new Date();
    const endTime = new Date(bannerData.timer_end);
    const timeRemaining = Math.max((endTime - now) / 1000, 0); // Remaining time in seconds

    const updatedBannerData = {
      ...bannerData,
      time_remaining: timeRemaining,
    };

    const url = isUpdate ? "/api/banner/update" : "/api/banner/create";
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    try {
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
        body: JSON.stringify(updatedBannerData),
      });

      if (!res.ok) {
        throw new Error("Failed to create/update banner");
      }

      toast.success(
        isUpdate ? "Banner updated successfully" : "Banner created successfully"
      );
      navigate("/"); // Redirect to home page
    } catch (error) {
      toast.error(error.message || "Failed to create/update banner");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {isUpdate ? "Update Banner" : "Create Banner"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Description:
            </label>
            <textarea
              name="description"
              value={bannerData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Link:
            </label>
            <input
              type="text"
              name="link"
              value={bannerData.link}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Timer Start:
            </label>
            <input
              type="datetime-local"
              name="timer_start"
              value={bannerData.timer_start}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Timer End:
            </label>
            <input
              type="datetime-local"
              name="timer_end"
              value={bannerData.timer_end}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 font-semibold mr-2">
              Visible:
            </label>
            <input
              type="checkbox"
              name="isVisible"
              checked={bannerData.isVisible}
              onChange={() =>
                setBannerData({
                  ...bannerData,
                  isVisible: !bannerData.isVisible,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isUpdate ? "Update Banner" : "Create Banner"}
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
