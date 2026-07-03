const BASE = "http://localhost:3001/api/v1";

const headers = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token")
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : {}),
});

// const handle = async (res) => {

//   console.log("RAW RESPONSE:", text);

//   try {
//     return JSON.parse(text);
//   } catch (err) {
//     console.error("Not JSON:", text);
//     throw err;
//   }
// };

const handle = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return { success: false, message: "Unauthorized" };
  }
  return res.json();
};

const api = {
  get: (url) => fetch(`${BASE}${url}`, { headers: headers() }).then(handle),
  post: (url, body) =>
    fetch(`${BASE}${url}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handle),

  delete: (url) =>
    fetch(`${BASE}${url}`, {
      method: "DELETE",
      headers: headers(),
    }).then(handle),
  
  patch: (url, body = {}) =>
  fetch(`${BASE}${url}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(body),
  }).then(handle),
};

export default api;
