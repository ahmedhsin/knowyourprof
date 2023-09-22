import Cookies from "js-cookie";
export const logged = () => {
  return Cookies.get("token") != undefined;
};
export const getType = () => {
  return Cookies.get("type");
};
