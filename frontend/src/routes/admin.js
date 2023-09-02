
import { useState, useEffect } from "react";
import post from "../hooks/post";
import get from "../hooks/get";
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

import { BiUpvote, BiDownvote } from "react-icons/bi";

const api_url = process.env.REACT_APP_API_URL;

const Reactions = ({review, orginalReact}) => {
  const redirect = useNavigate()
  const [react, setReact] = useState(
    orginalReact === undefined ? null : orginalReact
    );
  const [likes, setLikes] = useState(review.likes);
  const [dislikes, setDislikes] = useState(review.dislikes);
  const reactEndPoint = api_url + '/reviews/' + review.id + '/react';
  const sendReact = useMutation({
    mutationFn: (data)=>post(reactEndPoint, data, true),
    onSuccess:(data)=>{
      console.log(data)
    }
  })
  const handleReact = (newReaction) => {
    if (orginalReact === null) redirect('/login')
    console.log(react)
    console.log(newReaction)
    if (react === newReaction) {
      sendReact.mutate({ 'react': react})
      newReaction === true ? setLikes(likes - 1) : setDislikes(dislikes - 1);
      setReact(null);

    } else {
      sendReact.mutate({ 'react': newReaction})
      newReaction === true ? setLikes(likes + 1) : setDislikes(dislikes + 1);

      if (react !== null) {
        react === true ? setLikes(likes - 1) : setDislikes(dislikes - 1);
      }
      setReact(newReaction);
    }
        console.log(react)
    console.log(newReaction)
  };

  return (
    <div className="prof-review-reaction">
      <div className="prof-up-down">
        <BiUpvote
          className={`up-down-icon up-icon ${react === true ? 'clicked-react' : ''}`}
          onClick={() => handleReact(true)}
        />
        <p>{likes}</p>
      </div>
      <div className="prof-up-down">
        <BiDownvote
          className={`up-down-icon down-icon ${react === false ? 'clicked-react' : ''}`}
          onClick={() => handleReact(false)}
        />
        <p>{dislikes}</p>
      </div>
    </div>
  );
};

const Frame = ({id})=>(
    <iframe
    id="myIframe"
    src="/login"
    frameBorder="0"
    title="myIframe"
    className="frame"
    />
)


const Admin = () => {
  const reviewsQuery = {};
  reviewsQuery['isSuccess'] = false;

  return (
    <div id="prof-container">
      <div className="prof-header">
        {/*<Frame id={id}/>*/}
        <NavBar />
        <img src={bgHeader} className="prof-bground bg-img-dark" />
        <div className="prof-top">
          <div className="prof-review-box">
          </div>
          <div className="prof-img-data">
            <div className="prof-detials">
              <div className="prof-detials2">
                <div className="prof-stars">
                </div>
                <div className="prof-name">
                  <p className="prof-name-text">
                    {/*adminQuery.isSuccess && (adminQuery.data).name*/}
                  </p>
                </div>
              </div>

              <div className="prof-facilities">

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
              <button className="prof-review-btn prof-btn-mobile">
                Review
              </button>
            </div>
          </div>
        </div>
        <div className="admin-pending-bar">
            <div className="pending-reviews color">
              <p>Pending Reviews</p>
            </div>
            <div className="pending-profs color">
              <p>Pending profs</p>
            </div>
        </div>
        <div className="prof-reviews">
          {/*reviewsQuery.isSuccess &&
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
                  <Link className="prof-review-text-content" to=`/profs/{review.prof_id}`>{review.prof_id}</Link>
                  <p className="prof-review-text-overview">{review.overview}</p>
                  <p className="prof-review-text-content">{review.text}</p>

                </div>
                  {reactsQuery.isSuccess && <Reactions review={review} orginalReact={(reactsQuery.data)[review.id]}/>}
                  {!reactsQuery.isSuccess && <Reactions review={review} orginalReact={null}/>}
              </div>
            ))*/}


              <div className="prof-review">
                <div className="prof-review-header">
                  <div>
                    <img src={ellipsis} className="prof-option-bar" />
                  </div>
                  <div className="prof-review-user">
                    <div>
                      <p className="prof-review-user-name">blabla</p>
                      <p className="prof-review-user-date">2021-21-01 12:00</p>
                    </div>
                    <img
                      src={require("../assets/profile/p.jpg")}
                      alt=""
                      className="prof-review-user-img"
                    />
                  </div>
                </div>
                <div className="prof-review-text">
                  <p className="prof-review-text-content">prof name</p>
                  <p className="prof-review-text-content">id: 127asd.asdf.f.vcxvd.sad</p>
                  <p className="prof-review-text-overview">blabla</p>
                  <p className="prof-review-text-content">blablbalbalblablalba</p>
                </div>
              </div>



          {/*reviewsQuery.isSuccess &&
            reviews.length < (reviewsQuery.data).length && (
              <button
                className="see-more-reviews"
                onClick={() => setPage(page + 1)}
              >
                see More
              </button>
            )*/}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;