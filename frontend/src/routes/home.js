import { useState, useEffect } from "react";
import get from "../func/get";
import post from "../func/post";
import NavBar from "../components/Nav";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Bground from "../components/Bground";
import "../assets/home.css";
import Footer from "../components/Footer";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const redirect = useNavigate();
  const api_url = process.env.REACT_APP_API_URL;
  const [prof, setProf] = useState("");
  const [facility, setFacility] = useState("");
  const facilitiesEndPoint = api_url + "/facilities/filter";
  const queryFacility = `?name=${facility}&limit=5`;
  const profsEndPoint = api_url + "/profs/filter";
  const queryProf = `?name=${prof}&limit=5&facility=${facility}`;
  const profQuery = useQuery({
    queryKey: ["searchProfs"],
    queryFn: () => get(profsEndPoint + queryProf, false),
    enabled: prof.length >= 3,
  });

  const facilityQuery = useQuery({
    queryKey: ["searchFacility"],
    queryFn: () => get(facilitiesEndPoint + queryFacility, false),
    enabled: facility.length >= 3,
  });

  const select = (e) => {
    e.stopPropagation();
    e.target.focus();
    setFacility(e.target.innerText)
    //document.getElementById("facility").value = e.target.innerText;
  };

  return (
    <>
      <Bground blur="bg-img-blur" />
      {/*<NavBar />*/}
      <div className="home" id="home">
        <div className="">
          <Logo className="home-logo" />
        </div>
        <div
          className="search-inputs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const profValue = prof.trim() === "" ? "all" : prof;
              const facilityValue = facility.trim() === "" ? "all" : facility;
              redirect(`/search/${profValue}/${facilityValue}`);
            }
          }}
        >
          <div className="suggest-box-n" onClick={(e) => e.stopPropagation()}>
            <input
              className="search-prof"
              type="text"
              id="search-prof"
              name="name"
              autoComplete="off"
              placeholder="&#x1F50D;&nbsp;Write a professor’s name"
              onChange={(e) => {
                setProf(e.target.value);
              }}
            />
            <div
              className="suggest-n hidden "
              id="suggest-div-n"
              onClick={(e) => e.stopPropagation()}
            >
              {profQuery.isSuccess &&
                profQuery.data.map((item) => {
                  const path = "/profs/" + item["id"];
                  return (
                    <Link className="option" to={path} key={item["id"]}>
                      {item["name"]}
                    </Link>
                  );
                })}
            </div>
          </div>
          <div className="suggest-box-f">
            <input
              type="text"
              id="facility"
              className="search-facility"
              name="facility"
              autoComplete="off"
              value={facility}
              onClick={(e) => {
                e.stopPropagation();
              }}
              placeholder="&#127891;&nbsp;Select a university"
              onChange={(e) => setFacility(e.target.value)}
            />
            <div className="suggest-f hidden" id="suggest-div-f">
              {facilityQuery.isSuccess &&
                facilityQuery.data.map((item) => (
                  <p
                    className="option"
                    onClick={(e) => {
                      select(e);
                      e.stopPropagation();
                    }}
                    key={item["id"]}
                  >
                    {item["name"]}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
