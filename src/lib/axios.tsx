  import axios from "axios";

  const api = axios.create({
    baseURL: "https://api.talentbees.co/api",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
   // ONLY set JSON if we aren't sending FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  } else {
    // Delete the content-type to let the browser set it with the boundary
    delete config.headers["Content-Type"];
  }
    return config;
  });

  export default api;