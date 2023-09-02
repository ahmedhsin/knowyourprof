import { useState, useEffect } from 'react';
import post from '../hooks/post';
import get from '../hooks/get';
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import { ReactComponent as Logo } from  '../assets/logo.svg'
import '../assets/auth.css'
import NavList from '../components/NavList'
import Bground from '../components/Bground'
import { useQuery } from "@tanstack/react-query";

const api_url = process.env.REACT_APP_API_URL;

export const Login = ()=>{
	const redirect = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isQueryEnabled, setIsQueryEnabled] = useState(false);
	const data = {'email':email,'password':password, 'type':'user'}
	const loginEndPoint = api_url + '/auth/login'
	const loginQuery = useQuery({
	  	queryKey: ["login"],
	  	queryFn: ()=> post(loginEndPoint, data, false),
	  	enabled: isQueryEnabled,
	  	onSuccess: (data) => {
	  		if (data.token !== undefined){
				Cookies.set('token', data.token, { expires: 1 });
				//document.getElementById('myIframe').remove()
				redirect(-1)
			}
	  	},
	  	retry: 0,
	  	staleTime:0,
	  	onError: (err)=>{
	  		alert(err)
	  		setIsQueryEnabled(false)
	  	}
	})
	const login = (e)=>{
		e.preventDefault();
		console.log(loginQuery.isLoading);
		console.log("req")
		setIsQueryEnabled(true);
	}
	return (
		<>
		<NavList />
		<div className="container">
		<div className="side">
			<Bground dark="bg-img-dark"/>
			<Logo className="logo"/>
		</div>
		<form className="auth-container">
			<Logo className="logo-auth hidden" id="logo-auth"/>
			<Bground dark="bg-img-dark" className="hidden bg-auth-mobile"/>
			<div className="auth-input-container">
				<div className="auth-inputs-x">
					<input className="auth-inputs" type="text" placeholder="Email" name="email" onChange={(e)=>setEmail(e.target.value)} />
					<input className="auth-inputs" type="password" placeholder="Password" name="password" onChange={(e)=>setPassword(e.target.value)}/>

				</div>
				<div>
				<button className="auth-btn" onClick={(e)=>login(e)} disabled={isQueryEnabled} >Login</button>
				</div>
				<div>
					<p className="signup">you don't have an account? <Link className="signup-tag" to="/register">SignUp</Link></p>
				</div>
			</div>
		</form>
		</div>
		</>
	)
}

export const Logout = ()=>{
	const redirect = useNavigate()
	useEffect(()=>{
		Cookies.remove('token');
		redirect('/login')
	}, [])
	return null
}

export const Register = ()=>{
	const redirect = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [gender, setGender] = useState(true)
	const [isQueryEnabled, setIsQueryEnabled] = useState(false);

	const data = {'email':email,
	'password':password,
	'gender':gender,
	'name':name,
	'type':'user'}
	const registerEndPoint = api_url + '/auth/register'
	const registerQuery = useQuery({
	  	queryKey: ["register"],
	  	queryFn: ()=> post(registerEndPoint, data, false),
	  	enabled: isQueryEnabled,
	  	onSuccess: () => {
	  		console.log(registerQuery)
			redirect('/login')
	  	},
	  	retry: 0,
	  	staleTime:0,
	  	onError: (err)=>{
	  		alert(err)
	  		setIsQueryEnabled(false)
	  	}
	})
	const signUp = (e)=>{
		e.preventDefault();

		setIsQueryEnabled(true);
	}
	return (
		<>
		<NavList />
		<div className="container">
		<div className="side">
			<Bground dark="bg-img-dark"/>
			<Logo className="logo"/>
		</div>
		<form className="auth-container-reg">
			<Logo className="logo-auth logo hidden" id="logo-auth"/>
			<Bground dark="bg-img-dark" className="hidden bg-auth-mobile"/>
			<div className="auth-input-container">

				<div className="auth-inputs-x">
					<input className="auth-inputs name-auth" type="text" placeholder="Name" name="name" onChange={(e)=>setName(e.target.value)} />
					<input className="auth-inputs" type="text" placeholder="Email" name="email" onChange={(e)=>setEmail(e.target.value)} />
					<input className="auth-inputs" type="password" placeholder="Password" name="password" onChange={(e)=>setPassword(e.target.value)}/>
					<input className="auth-inputs" type="password" placeholder="Confirm Password" name="password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
				    <div className="dist-gender">
				      <div>
				      	<label>
				      		<input type="radio" name="gender" className="radio-auth" checked value="true" onChange={(e)=>setGender(e.target.value)} />
				      		Male
				      	</label>
				      </div>
				      <div>
				      	<label>
				      		<input type="radio" name="gender" className="radio-auth" value="false" onChange={(e)=>setGender(e.target.value)} />
				      		Female
				      	</label>
				      </div>
				    </div>
				</div>
				<div>
				<button className="auth-btn" onClick={(e)=>signUp(e)} disabled={isQueryEnabled} >Signup</button>
				</div>
				<div>
					<p className="signup">you have an account? <Link className="signup-tag" to="/login">Login</Link></p>
				</div>
			</div>
		</form>
		</div>
		</>
	)
}