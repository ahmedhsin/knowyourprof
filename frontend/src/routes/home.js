import { useState, useEffect } from "react";
import get from "../hooks/get";
import post from "../hooks/post";
import NavBar from "../components/Nav";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ReactComponent as Logo } from  '../assets/logo.svg'
import Bground from '../components/Bground'
import '../assets/home.css'
import Footer from '../components/Footer'
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";


const Home = () => {
	const api_url = process.env.REACT_APP_API_URL;
  const [prof, setProf] = useState("");
  const [facility, setFacility] = useState("");
  const facilitiesEndPoint = api_url + "/facilities/filter";
  const queryFacility = `?name=${facility}&limit=5`;
  const profsEndPoint = api_url + "/profs/filter";
  const queryProf = `?name=${prof}&limit=5&facility=${facility}`;
  const profQuery = useQuery({
  	queryKey: ["searchProfs"],
  	queryFn: ()=> get(profsEndPoint+queryProf, false),
  	enabled: prof.length >= 3,
  	onSuccess: function(){
  		document.getElementById('suggest-div-n').style.display='block';
  		document.getElementById('home').addEventListener('click', (e)=>hideInput(e, 'suggest-div-n'));
  	},
  	onError: (err)=>{
  		alert(err)
  	}
  });

  const facilityQuery = useQuery({
  	queryKey: ["searchFacility"],
  	queryFn: ()=> get(facilitiesEndPoint+queryFacility, false),
  	enabled: facility.length >= 3,
   	onSuccess: function(){
   		//if data.len < blabla
  		document.getElementById('suggest-div-f').style.display='block';
  		document.getElementById('home').addEventListener('click', (e)=>{hideInput(e, 'suggest-div-f')});
  	},
		onError: (err)=>{
			alert(err)
		}
  });
  const hideInput = (e, id)=> {
	  e.stopPropagation()
	  document.getElementById(id).style.display = 'none';
  }
  const select = (e) => {
		document.getElementById('facility').value = e.target.innerText
  }

  return (
  	<>
  	<Bground blur="bg-img-blur"/>
  	<NavBar />
    <div className="home" id="home">
    	<div className="">
    		<Logo className="home-logo"/>
    	</div>
        <div className="search-inputs">
	        <div className="suggest-box-n" onClick={(e)=>e.stopPropagation()}>
		        <input
		          className="search-prof"
		          type="text"
		          id="search-prof"
		          name="name"
		          autoComplete="off"
		          onClick={(e)=>e.stopPropagation()}
		          placeholder="&#xF52A;&nbsp;Write a professor’s name"
		          onChange={(e) => setProf(e.target.value)}
		        />
		        <div className="suggest-n hidden " id="suggest-div-n" onClick={(e)=>e.stopPropagation()}>

				  {profQuery.isSuccess &&
				    profQuery.data.map((item) => {
				      const path = "/profs/" + item["id"];
				      return (
				        <Link className="option"
				          to={path}
				          key={item["id"]}>
				          {item["name"]}
				        </Link>
				      );
				    })}
				</div>
	        </div>
	        <div className="suggest-box-f" onClick={(e)=>e.stopPropagation()}>
	        	<input
		          type="text"
		          id="facility"
		          className="search-facility"
		          name="facility"
		          autoComplete="off"
		          onClick={(e)=>e.stopPropagation()}
		          placeholder="&#127891;&nbsp;Select a university"
		          onChange={(e) => setFacility(e.target.value)}
		        />
						<div className="suggest-f hidden" id="suggest-div-f" onClick={(e)=>e.stopPropagation()}>
						  {facilityQuery.isSuccess &&
						    facilityQuery.data.map((item) => (
						      <p className="option"
						      	onClick={(e)=> {select(e)}}
						      	key={item["id"]}>
						        {item["name"]}
						      </p>
						    ))}
						</div>
	        </div>
        </div>

    </div>
    <Footer/>
    </>
  );
};
export default Home;
