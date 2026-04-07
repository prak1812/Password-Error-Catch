import axios from "axios";

const API = axios.create({
   baseURL: "https://password-error-catch-1.onrender.com/api/auth"
});

export default API;