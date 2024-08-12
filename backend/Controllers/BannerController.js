const connection = require("../utils/db"); // Import the connection

// Function to get banner
// Function to create or update a banner
const createOrUpdateBanner = async (req, res) => {
  const { id, description, link, isVisible, timer_start, timer_end } = req.body;
  console.log(req.body);

  // Validate required fields
  if (!description || !link || !isVisible || !timer_start || !timer_end) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Calculate time_remaining
  const now = new Date();
  const endTime = new Date(timer_end);
  const timeRemaining = Math.max((endTime - now) / 1000, 0); // Remaining time in seconds

  const bannerData = {
    description,
    link,
    isVisible: isVisible ? 1 : 0,
    timer_start,
    timer_end,
    time_remaining: timeRemaining,
  };

  let query, values;
  if (id) {
    // Update existing banner
    query = `UPDATE banners SET description = ?, link = ?, isVisible = ?, timer_start = ?, timer_end = ?, time_remaining = ? WHERE id = ?`;
    values = [
      bannerData.description,
      bannerData.link,
      bannerData.isVisible,
      bannerData.timer_start,
      bannerData.timer_end,
      bannerData.time_remaining,
      id,
    ];
  } else {
    // Create new banner
    query = `INSERT INTO banners (description, link, isVisible, timer_start, timer_end, time_remaining) VALUES (?, ?, ?, ?, ?, ?)`;
    values = [
      bannerData.description,
      bannerData.link,
      bannerData.isVisible,
      bannerData.timer_start,
      bannerData.timer_end,
      bannerData.time_remaining,
    ];
  }

  try {
    connection.query(query, values, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query failed", details: err.message });
      }
      res.status(200).json({
        message: id
          ? "Banner updated successfully"
          : "Banner created successfully",
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to get banner with time_remaining
const getBanner = async (req, res) => {
  try {
    const sql = "SELECT * FROM banners WHERE id=1";
    connection.query(sql, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query failed", details: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "No Banners currently" });
      }

      // Calculate time remaining
      const banner = result[0];
      const now = new Date();
      const endTime = new Date(banner.timer_end);
      const timeRemaining = Math.max((endTime - now) / 1000, 0); // Remaining time in seconds

      res.json({
        ...banner,
        time_remaining: timeRemaining, // Add remaining time to response
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrUpdateBanner,
  getBanner,
};
