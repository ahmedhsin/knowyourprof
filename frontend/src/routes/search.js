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
import { useQuery, useMutation } from "@tanstack/react-query";
import SomethingWrong from "../components/SomethingWrong";

const Search = () => {
  const { prof, facility } = useParams();
  const api_url = process.env.REACT_APP_API_URL;
  const profsEndPoint = api_url + "/profs/filter";
  const [page, setPage] = useState(0);
  const [profs, setProfs] = useState([]);
  const perPage = 1;
  const queryProf = `?limit=100&name=${prof}${
    facility === "all" ? "" : `&facility=${facility}`
  }`;
  const profQuery = useQuery({
    queryKey: ["searchProfs"],
    queryFn: () => get(profsEndPoint + queryProf, false),
    enabled: prof.length >= 3,
    onSuccess: (data) => {
      //console.log(data);
      setPage(1);
    },
  });

  useEffect(() => {
    if (profQuery.isSuccess) {
      setProfs(
        profs.concat(
          profQuery.data.slice(profs.length, profs.length + perPage),
        ),
      );
    }
  }, [page]);
  if (profQuery.isError) {
    return <SomethingWrong />;
  }

  return (
    <div id="prof-container">
      <div className="prof-header">
        {/*<Frame id={id}/>*/}
        {/*<NavBar />*/}
        <div className="prof-reviews">
          {profQuery.isSuccess && profs.length == 0 && (
            <div className="error mt-10">
              {" "}
              Unfortunately, no data matching your search criteria was found
            </div>
          )}
          {profQuery.isSuccess &&
            profs.map((prof) => (
              <div className="prof-review" key={prof.id}>
                <div className="prof-review-header">
                  <div></div>
                  <div className="prof-review-user">
                    <StarRating
                      valid={false}
                      rating={prof.average_rating}
                      key={prof.id}
                    />
                    <div>
                      <Link
                        id="sp-link"
                        className="prof-review-user-name"
                        to={`/profs/${prof.id}`}
                        target="_blank"
                      >
                        {prof.name}
                      </Link>
                      <p className="prof-review-user-date">
                        {prof.facilities
                          .map((obj) => obj.name)
                          .join(",")
                          .slice(0, 25) + "..."}
                      </p>
                      <p className="prof-review-user-date">
                        {prof.total_reviews} reviews
                      </p>
                    </div>
                    <img
                      src={require("../assets/profile/p.jpg")}
                      alt=""
                      className="prof-review-user-img"
                    />
                  </div>
                </div>
                <div className="prof-review-text"></div>
              </div>
            ))}
          {profQuery.isSuccess && profs.length < profQuery.data.length && (
            <button
              className="see-more-reviews"
              onClick={() => setPage(page + 1)}
            >
              see More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Search;
