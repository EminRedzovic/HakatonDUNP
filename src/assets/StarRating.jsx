import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ initialRating = 0, totalStars = 5, isEditable = true, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  // If the rating is passed as a prop, set it initially
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (star) => {
    if (isEditable) {
      setRating(star); // Update the rating only if it's editable
      if (onRatingChange) {
        onRatingChange(star); // Call the onRatingChange function to log or update the parent state
      }
    }
  };

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {Array.from({ length: totalStars }, (_, index) => {
        const star = index + 1;
        return (
          <FaStar
            key={index}
            size={24}
            color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"} // Yellow for active stars, gray for inactive
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: isEditable ? "pointer" : "default" }} // Disable pointer cursor if not editable
          />
        );
      })}
    </div>
  );
};

export default StarRating;
