import Cookies from "js-cookie";

const get = (endpoint, auth) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers["Authorization"] = "Bearer " + Cookies.get("token");
  }
  return fetch(endpoint, {
    method: "GET",
    credentials: "include",
    headers: headers,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Request failed with status: " + response.status);
    }
  });
};

export default get;
