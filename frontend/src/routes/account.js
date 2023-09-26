import { useState, useEffect } from "react";
import post from "../func/post";
import delet from "../func/delete";
import get from "../func/get";
import { useNavigate, Link, useParams } from "react-router-dom";
import NavBar from "../components/Nav";
import bgHeader from "../assets/bg.jpg";
import "../assets/admin.css";
import up from "../assets/icons/up.svg";
import down from "../assets/icons/down.svg";
import ellipsis from "../assets/icons/ellipsis.svg";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import Review from "../components/Review";
import SomethingWrong from "../components/SomethingWrong";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { useQueryClient } from "@tanstack/react-query";

const api_url = process.env.REACT_APP_API_URL;

const ManpulateReview = ({ id, review, setSelected, prof_id }) => {
  const EndPoint = `${api_url}/reviews/${review.id}`;
  const queryClient = useQueryClient();

  const sendDelete = useMutation({
    mutationFn: () => delet(EndPoint, {}, true),
    onSuccess: () => {
      queryClient.invalidateQueries(`getReviews_${prof_id}`)
    }
  });
  return (
    <div className="prof-review-reaction">
      <button
        className="prof-review-btn"
        onClick={(e) => {
          setSelected(review);
          document.getElementById("review-prof-box").style.display = "block";
          document.getElementById("overlay").style.display = "block";
        }}
      >
        update
      </button>
      <button
        className="prof-review-btn"
        onClick={(e) => {
          sendDelete.mutate();
          e.target.parentElement.innerHTML =
            '<p className="admin-manpulate" style="color: gray">deleted</p>';
        }}
      >
        delete
      </button>
    </div>
  );
};

const Account = () => {
  const userEndPoint = api_url + "/account/user";
  const ReviewsEndPoint = api_url + "/account/reviews";

  const perPage = 10;
  const [pageReviews, setPageReviews] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState([]);
  const userQuery = useQuery({
    queryKey: ["getUser"],
    queryFn: () => get(userEndPoint, true),
  });
  const ReviewsQuery = useQuery({
    queryKey: ["getAccountReviews"],
    queryFn: () => get(ReviewsEndPoint, true),
    onSuccess: () => {
      setReviews([]);
      setPageReviews(1);
    },
  });
  useEffect(() => {
    if (ReviewsQuery.isSuccess) {
      setReviews(
        reviews.concat(
          ReviewsQuery.data.slice(reviews.length, reviews.length + perPage),
        ),
      );
    }
  }, [pageReviews, ReviewsQuery.isFetching]);

  if (ReviewsQuery.isError || userQuery.isError) {
    return <SomethingWrong />;
  }
  return (
    <div id="prof-container">
      <div className="prof-header">
        <Review
          prof_id={selectedReview.prof_id}
          id={selectedReview.id}
          text={selectedReview.text}
          ratingNum={selectedReview.rating}
          overview={selectedReview.overview}
          anonymous={selectedReview.user == "anonymous"}
          setSelected={setSelectedReview}
          selected = {selectedReview}
          type={1}
        />
        <img src={bgHeader} className="prof-bground bg-img-dark" />
        <div className="prof-top">
          <div className="prof-review-box"></div>
          <div className="prof-img-data">
            <div className="prof-detials">
              <div className="prof-detials2">
                <div className="prof-stars"></div>
                <div className="prof-name">
                  <p className="prof-name-text">
                    {userQuery.isSuccess && userQuery.data.name}
                  </p>
                </div>
              </div>

              <div className="prof-facilities"></div>
            </div>
            <div>
              <img
                className="prof-pic"
                src={require("../assets/profile/p.jpg")}
                alt=""
              />
            </div>
            <div className="prof-review-box-mobile"></div>
          </div>
        </div>

        <div className="prof-reviews">
          {ReviewsQuery.isSuccess &&
            reviews.map((review, i) => (
              <div className="prof-review" key={i}>
                <div className="prof-review-header">
                  <div></div>
                  <div className="prof-review-user">
                    <StarRating valid={false} rating={review.rating} />
                    <div>
                      <p className="prof-review-user-date">
                        {review["created_at"] &&
                          (review["created_at"] === review["updated_at"]
                            ? review["created_at"]
                            : "edited " + review["updated_at"])}
                      </p>
                      <p className="prof-review-user-date">
                        {review['approved'] ? 'Approved' : 'Pending Further Review'}
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
                  <Link
                    target="_blank"
                    className="prof-review-text-content prof-review-text-overview"
                    id="prof-id-reviews"
                    to={`/profs/${review.prof_id}`}
                  >
                    {review.prof_id}
                  </Link>
                  <p className="prof-review-text-overview">{review.overview}</p>
                  <p className="prof-review-text-content">{review.text}</p>
                </div>
                <ManpulateReview
                  type={"reviews"}
                  review={review}
                  prof_id={review.prof_id}
                  setSelected={setSelectedReview}
                />
              </div>
            ))}

          {ReviewsQuery.isSuccess && !ReviewsQuery.isFetching&&
            reviews.length < ReviewsQuery.data.length && (
              <button
                className="see-more-reviews"
                onClick={() => setPageReviews(pageReviews + 1)}
              >
                see More
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Account;
