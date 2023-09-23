import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import post from "../func/post";
import bgHeader from "../assets/bg.jpg";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import "../assets/review.css";
import { useQuery } from "@tanstack/react-query";
import get from "../func/get";

import { useQueryClient } from "@tanstack/react-query";

const AddProf = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const addProfEndPoint = api_url + "/profs/new";
  const [facility, setFacility] = useState("");
  const facilitiesEndPoint = api_url + "/facilities/filter";
  const queryFacility = `?name=${facility}&limit=5`;
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    gender: "true",
  });

  const addProf = useMutation({
    mutationFn: (data) => post(addProfEndPoint, data, true),
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const cancel = () => {
    document.getElementById("add-prof-box").style.display = "none";
    document.getElementById("overlay-prof").style.display = "none";
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addProf.mutate(formData);
    setTimeout(() => {
      cancel();
      addProf.reset();
    }, 1500);
  };
  const facilityQuery = useQuery({
    queryKey: ["searchFacility"],
    queryFn: () => get(facilitiesEndPoint + queryFacility, false),
    enabled: facility.length >= 3,

  });

  const select = (e) => {
    e.stopPropagation();
    e.target.focus();
    document.getElementById("facility").value = e.target.innerText;
    setFormData({
      ...formData,
      facility: e.target.innerText,
    });
  };
  /*
  useEffect(()=>{
    document.getElementById('review-prof-box').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }, [])
  */
  return (
    <>
      <div id="overlay-prof"></div>
      <div id="add-prof-box">

        {addProf.isError && <div className="error">Something went wrong !</div>}
        {addProf.isSuccess && (
          <div className="success">
            successfully submitted! Awaiting approval
          </div>
        )}
        <div><p className="p-6">Request a professor</p></div>
        <form onSubmit={handleFormSubmit} className="review-form">
          <div>
            <input
              id="overview"
              name="name"
              placeholder="name"
              className="review-prof-inputs"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            {/*
            <input
              id="text"
              name="facility"
              placeholder="facility"
              className="review-prof-inputs review-prof-inputs-1"
              value={formData.facility}
              onChange={handleInputChange}
              required
            />*/}
            {
              <div className="suggest-box-f">
                <input
                  type="text"
                  id="facility"
                  className="search-facility review-prof-inputs review-prof-inputs-1"
                  name="facility"
                  placeholder="facility"
                  required
                  autoComplete="off"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  placeholder="&#127891;&nbsp;Select a university"
                  onChange={(e) => {
                    setFacility(e.target.value);
                    handleInputChange(e);
                  }}
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
            }
          </div>

          <div>
            {/* Gender Selection */}
            <div className="flex p-6">
              <div className="p-6">
                <label className="p-2">Male</label>
                <input
                  type="radio"
                  name="gender"
                  value="true"
                  onChange={handleInputChange}
                  checked={formData.gender === "true"}
                />
              </div>
              <div className="p-6">
                <label className="p-2">Female</label>
                <input
                  type="radio"
                  name="gender"
                  value="false"
                  onChange={handleInputChange}
                  checked={formData.gender === "false"}
                />
              </div>
            </div>
          </div>

          <div className="review-prof-inputs-anon">
            <button
              type="submit"
              disabled={addProf.isLoading}
              className="review-prof-inputs-btn"
            >
              Add
            </button>
            <button
              type="button"
              disabled={addProf.isLoading}
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

export default AddProf;