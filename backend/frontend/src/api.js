import axios from "axios";

const API = axios.create({
   baseURL: "https://password-error.onrender.com/api/auth"
});

export default API;