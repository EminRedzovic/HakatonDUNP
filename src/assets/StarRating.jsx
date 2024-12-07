import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0); // Holds the selected star rating

  // Function to update the rating
  const handleClick = (star) => {
    setRating(star);
  };

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {Array.from({ length: totalStars }, (_, index) => {
        const star = index + 1;
        return (
          <FaStar
            key={index}
            size={24}
            color={star <= rating ? "#ffc107" : "#e4e5e9"} // Yellow for active stars, gray for inactive
            onClick={() => handleClick(star)}
            style={{ cursor: "pointer" }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;