import { useState, useEffect } from "react";
import post from "../func/post";
import get from "../func/get";
import { useNavigate, Link, useParams } from "react-router-dom";
import NavBar from "../components/Nav";
import bgHeader from "../assets/bg.jpg";
import "../assets/profs.css";
import up from "../assets/icons/up.svg";
import down from "../assets/icons/down.svg";
import ellipsis from "../assets/icons/ellipsis.svg";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import SomethingWrong from "../components/SomethingWrong";

import Review from "../components/Review";

import Cookies from "js-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";

import { BiUpvote, BiDownvote } from "react-icons/bi";

const api_url = process.env.REACT_APP_API_URL;

const Reactions = ({ review, orginalReact }) => {
  const redirect = useNavigate();
  const [react, setReact] = useState(
    orginalReact === undefined ? null : orginalReact,
  );
  const [likes, setLikes] = useState(review.likes);
  const [dislikes, setDislikes] = useState(review.dislikes);
  const reactEndPoint = api_url + "/reviews/" + review.id + "/react";
  const sendReact = useMutation({
    mutationFn: (data) => post(reactEndPoint, data, true),
    onSuccess: (data) => {
      //console.log(data);
    },
  });
  const handleReact = (newReaction) => {
    if (orginalReact === null) redirect("/login");
    //console.log(react);
    //console.log(newReaction);
    if (react === newReaction) {
      sendReact.mutate({ react: react });
      newReaction === true ? setLikes(likes - 1) : setDislikes(dislikes - 1);
      setReact(null);
    } else {
      sendReact.mutate({ react: newReaction });
      newReaction === true ? setLikes(likes + 1) : setDislikes(dislikes + 1);

      if (react !== null) {
        react === true ? setLikes(likes - 1) : setDislikes(dislikes - 1);
      }
      setReact(newReaction);
    }
    //console.log(react);
    //console.log(newReaction);
  };

  return (
    <div className="prof-review-reaction">
      <div className="prof-up-down">
        <BiUpvote
          className={`up-down-icon up-icon ${
            react === true ? "clicked-react" : ""
          }`}
          onClick={() => handleReact(true)}
        />
        <p>{likes}</p>
      </div>
      <div className="prof-up-down">
        <BiDownvote
          className={`up-down-icon down-icon ${
            react === false ? "clicked-react" : ""
          }`}
          onClick={() => handleReact(false)}
        />
        <p>{dislikes}</p>
      </div>
    </div>
  );
};

const Profs = () => {
  const { id } = useParams();
  const redirect = useNavigate();

  const profEndPoint = api_url + "/profs/" + id;
  const userReactsEndpoint = api_url + "/profs/" + id + "/reviews/react/all";
  const profReviewsEndPoint = api_url + "/profs/" + id + "/reviews";
  const perPage = 5;
  const [page, setPage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const profQuery = useQuery({
    queryKey: ["getProf"],
    queryFn: () => get(profEndPoint, false),
  });
  const reviewsQuery = useQuery({
    queryKey: ["getReviews"],
    queryFn: () => get(profReviewsEndPoint, false),
    onSuccess: (data) => {
      setPage(1);
    },
  });
  const reactsQuery = useQuery({
    queryKey: ["getReacts"],
    queryFn: () => get(userReactsEndpoint, true),
    enabled: Cookies.get("token") !== undefined,
  });

  useEffect(() => {
    if (reviewsQuery.isSuccess) {
      setReviews(
        reviews.concat(
          reviewsQuery.data.slice(reviews.length, reviews.length + perPage),
        ),
      );
    }
  }, [page, reviewsQuery.isFetching]);
  const handelReview = () => {
    document.getElementById("review-prof-box").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  };
  if (profQuery.isError || reactsQuery.isError || reviewsQuery.isError) {
    return <SomethingWrong />;
  }
  return (
    <div id="prof-container">
      <Review id={id} text={""} ratingNum={1} overview={""} anonymous={false} />
      <div className="prof-header">
        {/*<Frame id={id}/>*/}
        {/*<NavBar />*/}
        <img src={bgHeader} className="prof-bground bg-img-dark" />
        <div className="prof-top">
          <div className="prof-review-box">
            <button
              className="prof-review-btn prof-hide"
              id="prof-review-btn"
              onClick={(e) => {
                handelReview();
              }}
            >
              Review
            </button>
          </div>
          <div className="prof-img-data">
            <div className="prof-detials">
              <div className="prof-detials2">
                <div className="prof-stars">
                  {profQuery.isSuccess && (
                    <StarRating
                      valid={false}
                      rating={Math.round(profQuery.data.average_rating)}
                    />
                  )}
                  <p className="prof-reviews-num">
                    {reviewsQuery.isSuccess &&
                      (reviewsQuery.data.length == 1
                        ? reviewsQuery.data.length + " review"
                        : reviewsQuery.data.length + " reviews")}
                  </p>
                </div>
                <div className="prof-name">
                  <p className="prof-name-text">
                    prof. {profQuery.isSuccess && profQuery.data.name}
                  </p>
                </div>
              </div>

              <div className="prof-facilities">
                <p>
                  {profQuery.isSuccess &&
                    profQuery.data.facilities
                      .map((obj) => obj.name)
                      .join(",")
                      .slice(0, 15) + "..."}
                </p>
              </div>
            </div>
            <div>
              <img
                className="prof-pic"
                src={require("../assets/profile/p.jpg")}
                alt=""
              />
            </div>
            <div className="prof-review-box-mobile">
              <button
                className="prof-review-btn prof-btn-mobile"
                onClick={handelReview}
              >
                Review
              </button>
            </div>
          </div>
        </div>
        <div className="prof-reviews">
          {reviewsQuery.isSuccess &&
            reviews.map((review) => (
              <div className="prof-review">
                <div className="prof-review-header">
                  <div>
                    <img src={ellipsis} className="prof-option-bar" />
                  </div>
                  <div className="prof-review-user">
                    <StarRating valid={false} rating={review.rating} />
                    <div>
                      <p className="prof-review-user-name">{review.user}</p>
                      <p className="prof-review-user-date">
                        {review["created_at"] &&
                          (review["created_at"] === review["updated_at"]
                            ? review["created_at"]
                            : "edited " + review["updated_at"])}
                      </p>
                    </div>
                    <img
                      src={require("../assets/profile/p.jpg")}
                      alt=""
                      className="prof-review-user-img"
                    />
                  </div>
                </div>
                <div className="prof-review-text">
                  <p className="prof-review-text-overview">{review.overview}</p>
                  <p className="prof-review-text-content">{review.text}</p>
                </div>
                {reactsQuery.isSuccess && (
                  <Reactions
                    review={review}
                    orginalReact={reactsQuery.data[review.id]}
                  />
                )}
                {!reactsQuery.isSuccess && (
                  <Reactions review={review} orginalReact={null} />
                )}
              </div>
            ))}
          {reviewsQuery.isSuccess &&
            reviews.length < reviewsQuery.data.length && (
              <button
                className="see-more-reviews"
                onClick={() => setPage(page + 1)}
              >
                see More
              </button>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profs;
