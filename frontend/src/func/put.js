import Cookies from "js-cookie";

const put = (endpoint, data, auth) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers["Authorization"] = "Bearer " + Cookies.get("token");
  }

  return fetch(endpoint, {
    method: "PUT",
    credentials: "include",
    headers: headers,
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Request failed with status: " + response.status);
    }
  });
};

export default put;
