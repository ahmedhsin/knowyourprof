import React, { useState } from "react";
import { IoMdStar } from "react-icons/io";
import '../assets/starrating.css'
const StarRating = ({valid, rating, setRating}) => {
  const [hover, setHover] = useState(null);
  if (valid){
    document.getElementById('starrating-icon').style.cursor = 'pointer'
  }
  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          <label>
            <input
              type="radio"
              name="rating-inputs"
              value={ratingValue}
              {...(valid && { onClick: () => setRating(ratingValue) })}
            />
            <IoMdStar
              key={i}
              className="starrating-icon"
              id="starrating-icon"
              size={100}
              color={ratingValue <= (hover || rating) ? "#f7bc34" : "#e4e5e9"}
              {...(valid && { onMouseEnter: () => setHover(ratingValue) })}
              {...(valid && { onMouseLeave: () => setHover(null) })}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
