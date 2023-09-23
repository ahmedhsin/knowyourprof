import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, Link, useParams } from "react-router-dom";
import post from "../func/post";
import put from "../func/put";
import get from "../func/get";
import bgHeader from "../assets/bg.jpg";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import "../assets/review.css";
import { useQueryClient } from "@tanstack/react-query";

const Review = (props) => {
  const queryClient = useQueryClient();
  const { id, text, ratingNum, overview, anonymous, type, setSelected } = props;
  const api_url = process.env.REACT_APP_API_URL;
  const profEndPoint = api_url + "/profs/" + id;
  const reviewEndPoint = api_url + "/profs/" + id + "/reviews/new";
  const updateReviewEndPoint = api_url + "/reviews/" + id;
  const [rating, setRating] = useState(ratingNum);
  const [formData, setFormData] = useState({
    text: "",
    rating: "",
    overview: "",
    anonymous: false,
  });
  useEffect(() => {
    setFormData({
      text: text,
      rating: ratingNum,
      overview: overview,
      anonymous: anonymous,
    });
    setRating(ratingNum);
  }, [id]);
  const review = useMutation({
    mutationFn: (data) => post(reviewEndPoint, data, true),
  });
  const updateReview = useMutation({
    mutationFn: (data) => put(updateReviewEndPoint, data, true),
    onSuccess: (data) => {
      //console.log(data);
      queryClient.invalidateQueries("getPendingReviews");
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: inputValue,
      rating: rating,
    });
  };
  useEffect(() => {
    setFormData({
      ...formData,
      rating: rating,
    });
  }, [rating]);
  const cancel = () => {
    document.getElementById("review-prof-box").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (type === undefined) {
      review.mutate(formData);
    } else {
      updateReview.mutate(formData);
    }
    setTimeout(() => {
      cancel();
      review.reset();
      updateReview.reset();
    }, 1500);
  };
  console.log(formData)
  return (
    <>
      <div id="overlay"></div>
      <div id="review-prof-box">
        {review.isError && <div className="error">Something went wrong !</div>}
        {review.isSuccess && (
          <div className="success">
            successfully submitted! Awaiting approval
          </div>
        )}
        {updateReview.isError && (
          <div className="error">Something went wrong !</div>
        )}
        {updateReview.isSuccess && (
          <div className="success">
            successfully submitted! Awaiting approval!
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="review-form">
          <div>
            <input
              id="overview"
              name="overview"
              placeholder="overview"
              className="review-prof-inputs"
              value={formData.overview}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              id="text"
              name="text"
              placeholder="review"
              className="review-prof-inputs review-prof-inputs-1"
              value={formData.text}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="review-prof-inputs-div">
            <StarRating
              id="starrating-icon"
              name="rating"
              valid={true}
              rating={rating}
              setRating={setRating}
            />
          </div>
          <div className="review-prof-inputs-div review-prof-inputs-anon">
            <label>anonymous</label>
            <input
              type="checkbox"
              id="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleInputChange}
            />
          </div>

          <div className="review-prof-inputs-anon">
            <button
              type="submit"
              disabled={review.isLoading}
              className="review-prof-inputs-btn"
            >
              {type === undefined ? "Review" : "Update"}
            </button>
            <button
              type="button"
              disabled={review.isLoading}
              className="review-prof-inputs-btn"
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Review;
