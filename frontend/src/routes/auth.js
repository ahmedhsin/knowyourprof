import { useState, useEffect, useRef } from "react";
import post from "../func/post";
import get from "../func/get";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ReactComponent as Logo } from "../assets/logo.svg";
import "../assets/auth.css";
import Bground from "../components/Bground";
import { useQuery, useMutation } from "@tanstack/react-query";
const api_url = process.env.REACT_APP_API_URL;

export const Login = ({ setAuth }) => {
  const redirect = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");
  const data = { email: email, password: password, type: type };
  const loginEndPoint = api_url + "/auth/login";

  const loginQuery = useMutation({
    mutationFn: (data) => post(loginEndPoint, data, false),
    onSuccess: (data) => {
      if (data.token !== undefined) {
        Cookies.set("token", data.token, { expires: 1 });
        Cookies.set("type", data.type, { expires: 1 });
        setAuth({ isLogged: true, type: data.type });
        redirect("/");
      }
    },
  });
  const login = (e) => {
    e.preventDefault();
    loginQuery.mutate(data);
  };
  return (
    <>
      {/*<NavBar />*/}
      <div className="container">
        <div className="side">
          <Bground dark="bg-img-dark" />
          <Logo className="logo" />
        </div>
        <form className="auth-container" onSubmit={(e) => login(e)}>
          <Logo className="logo-auth hidden" id="logo-auth" />
          <Bground dark="bg-img-dark" className="hidden bg-auth-mobile" />
          <div className="auth-input-container">
            <div className="auth-inputs-x">
              <input
                className="auth-inputs"
                required
                type="text"
                placeholder="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="auth-inputs"
                required
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="dist-gender">
              <div>
                <label>
                  <input
                    type="radio"
                    name="type"
                    className="radio-auth"
                    checked
                    value="user"
                    onChange={(e) => setType(e.target.value)}
                  />
                  User
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="type"
                    className="radio-auth"
                    value="admin"
                    onChange={(e) => setType(e.target.value)}
                  />
                  Admin
                </label>
              </div>
            </div>
            <div>
              {loginQuery.isError && (
                <div className="error">Incorrect Login Information</div>
              )}

              <button
                className="auth-btn"
                type="submit"
                disabled={loginQuery.isLoading}
              >
                Login
              </button>
            </div>
            <div>
              <p className="signup">
                you don't have an account?{" "}
                <Link className="signup-tag" to="/register">
                  SignUp
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export const Logout = ({ setAuth }) => {
  const redirect = useNavigate();
  useEffect(() => {
    Cookies.remove("token");
    setAuth({ isLogged: false, type: "" });
    redirect("/login");
  }, []);
  return null;
};

export const Register = () => {
  const redirect = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState(true);

  const data = {
    email: email,
    password: password,
    gender: gender,
    name: name,
    type: "user",
  };
  const registerEndPoint = api_url + "/auth/register";
  const registerQuery = useMutation({
    mutationFn: (data) => post(registerEndPoint, data, false),
    onSuccess: () => {
      setTimeout(() => redirect("/login"), 1500);
    },
  });
  const signUp = (e) => {
    e.preventDefault();
    registerQuery.mutate(data);
  };
  //console.log(registerQuery);
  return (
    <>
      {/*<NavBar />*/}
      <div className="container">
        <div className="side">
          <Bground dark="bg-img-dark" />
          <Logo className="logo" />
        </div>
        <form className="auth-container-reg" onSubmit={(e) => signUp(e)}>
          <Logo className="logo-auth logo hidden" id="logo-auth" />
          <Bground dark="bg-img-dark" className="hidden bg-auth-mobile" />
          <div className="auth-input-container">
            <div className="auth-inputs-x">
              <input
                required
                className="auth-inputs name-auth"
                type="text"
                placeholder="Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                required
                className="auth-inputs"
                type="text"
                placeholder="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                required
                className="auth-inputs"
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                required
                className="auth-inputs"
                type="password"
                placeholder="Confirm Password"
                name="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="dist-gender">
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      className="radio-auth"
                      checked
                      value="true"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Male
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      className="radio-auth"
                      value="false"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
            {(password != confirmPassword && (
              <div className="error">Passwords Don't Match</div>
            )) ||
              (registerQuery.isError &&
                registerQuery.error.message.includes("409") && (
                  <div className="error">Email Already Exists</div>
                )) ||
              (registerQuery.isError && (
                <div className="error">Something Went Wrong</div>
              )) ||
              (registerQuery.isSuccess && (
                <div className="success">Account Successfully Created</div>
              ))}

            <div>
              <button
                className="auth-btn"
                type="submit"
                disabled={registerQuery.isLoading}
              >
                Signup
              </button>
            </div>
            <div>
              <p className="signup">
                you have an account?{" "}
                <Link className="signup-tag" to="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
