import { useState, useEffect } from "react";
import post from "../func/post";
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
import SomethingWrong from "../components/SomethingWrong";

import Cookies from "js-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";

import { BiUpvote, BiDownvote } from "react-icons/bi";
import { useQueryClient } from "@tanstack/react-query";
const api_url = process.env.REACT_APP_API_URL;

const ManpulatePending = ({ type, id, prof_id }) => {
  const queryClient = useQueryClient();
  const approve = `${api_url}/admin/${type}/${id}/approve`;
  const reject = `${api_url}/admin/${type}/${id}/reject`;
  const sendApprove = useMutation({
    mutationFn: (data) => post(approve, {}, true),
    onSuccess:() => {
      queryClient.invalidateQueries("getAccountReviews");
      if (type === 'reviews')
        queryClient.invalidateQueries(`getReviews_${prof_id}`);
    }
  });
  const sendReject = useMutation({
    mutationFn: () => post(reject, {}, true),
    onSuccess: ()=>{
      queryClient.invalidateQueries("getAccountReviews");
    }
  });
  return (
    <div className="prof-review-reaction">
      <button
        className="prof-review-btn"
        onClick={(e) => {
          sendApprove.mutate();
          e.target.parentElement.innerHTML =
            '<p className="admin-manpulate" style="color: gray">Approved</p>';
        }}
      >
        Approve
      </button>
      <button
        className="prof-review-btn"
        onClick={(e) => {
          sendReject.mutate();
          e.target.parentElement.innerHTML =
            '<p className="admin-manpulate" style="color: gray">Rejected</p>';
        }}
      >
        Reject
      </button>
    </div>
  );
};


const Admin = () => {
  const adminEndPoint = api_url + "/account/admin";
  const pendingProfsEndPoint = api_url + "/admin/profs/pending";
  const pendingReviewsEndPoint = api_url + "/admin/reviews/pending";

  const perPage = 5;
  const [pageReviews, setPageReviews] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [pageProfs, setPageProfs] = useState(0);
  const [profs, setProfs] = useState([]);

  const adminQuery = useQuery({
    queryKey: ["getAdmin"],
    queryFn: () => get(adminEndPoint, true),
  });
  const pendingReviewsQuery = useQuery({
    queryKey: ["getPendingReviews"],
    queryFn: () => get(pendingReviewsEndPoint, true),
    onSuccess: () => setPageReviews(pageReviews),
  });
  const pendingProfsQuery = useQuery({
    queryKey: ["getPendingProfs"],
    queryFn: () => get(pendingProfsEndPoint, true),
    onSuccess: () => setPageProfs(pageProfs),
  });

  useEffect(() => {
    if (pendingReviewsQuery.isSuccess) {
      setReviews(
        reviews.concat(
          pendingReviewsQuery.data.slice(
            reviews.length,
            reviews.length + perPage,
          ),
        ),
      );
    }
  }, [pageReviews, pendingReviewsQuery.isFetching]);
  useEffect(() => {
    if (pendingProfsQuery.isSuccess) {
      setProfs(
        profs.concat(
          pendingProfsQuery.data.slice(profs.length, profs.length + perPage),
        ),
      );
    }
  }, [pageProfs, pendingProfsQuery.isFetching]);
  if (
    adminQuery.isError ||
    pendingReviewsQuery.isError ||
    pendingProfsQuery.isError
  ) {
    return <SomethingWrong />;
  }
  return (
    <div id="prof-container">
      <div className="prof-header">
        {/*<Frame id={id}/>*/}
        {/*<NavBar />*/}
        <img src={bgHeader} className="prof-bground bg-img-dark" />
        <div className="prof-top">
          <div className="prof-review-box"></div>
          <div className="prof-img-data">
            <div className="prof-detials">
              <div className="prof-detials2">
                <div className="prof-stars"></div>
                <div className="prof-name">
                  <p className="prof-name-text">
                    {adminQuery.isSuccess && adminQuery.data.name}
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
        <div className="admin-pending-bar">
          <div className="pending-reviews color">
            <p
              onClick={() => {
                document.getElementById("admin-reviews-pending").style.display =
                  "flex";
                document.getElementById("admin-profs-pending").style.display =
                  "none";
              }}
            >
              Pending Reviews
            </p>
          </div>
          <div className="pending-profs color">
            <p
              onClick={() => {
                document.getElementById("admin-profs-pending").style.display =
                  "flex";
                document.getElementById("admin-reviews-pending").style.display =
                  "none";
              }}
            >
              Pending profs
            </p>
          </div>
        </div>
        <div className="prof-reviews" id="admin-reviews-pending">
          {pendingReviewsQuery.isSuccess &&
            reviews.map((review) => (
              <div className="prof-review">
                <div className="prof-review-header">
                  <div></div>
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
                <ManpulatePending type={"reviews"} id={review.id} prof_id={review.prof_id} />
              </div>
            ))}

          {pendingReviewsQuery.isSuccess &&
            reviews.length < pendingReviewsQuery.data.length && (
              <button
                className="see-more-reviews"
                onClick={() => setPageReviews(pageReviews + 1)}
              >
                see More
              </button>
            )}
        </div>
        {/*profs part*/}
        <div className="prof-reviews" id="admin-profs-pending">
          {pendingProfsQuery.isSuccess &&
            profs.map((prof) => (
              <div className="prof-review">
                <div className="prof-review-header">
                  <div></div>
                  <div className="prof-review-user">
                    <div>
                      <p className="prof-review-user-name">{prof.name}</p>
                      <p className="prof-review-user-date">
                        {prof["created_at"] &&
                          (prof["created_at"] === prof["updated_at"]
                            ? prof["created_at"]
                            : "edited " + prof["updated_at"])}
                      </p>
                      <p className="prof-review-user-date">
                        {prof.facilities
                          .map((obj) => obj.name)
                          .join(",")
                          .slice(0, 25) + "..."}
                      </p>
                    </div>
                    <img
                      src={require("../assets/profile/p.jpg")}
                      alt=""
                      className="prof-review-user-img"
                    />
                  </div>
                </div>
                <ManpulatePending type={"profs"} id={prof.id} />
              </div>
            ))}

          {pendingProfsQuery.isSuccess &&
            profs.length < pendingProfsQuery.data.length && (
              <button
                className="see-more-reviews"
                onClick={() => setPageProfs(pageProfs + 1)}
              >
                see More
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
